<template>
  <n-drawer
    v-model:show="show"
    :width="502"
    placement="left"
    :block-scroll="false"
  >
    <n-drawer-content footer-class="gap-2">
      <img
        v-if="note.cover"
        :src="`${UPLOADS_BASE_URL}/${note.cover}`"
        class="aspect-video object-cover object-center w-full"
      />
      <n-h1>{{ note.title }}</n-h1>
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        class="flex flex-col gap-2"
      >
        <n-form-item label="State" path="state">
          <n-select :options="stateOptions" v-model:value="formValue.state" />
        </n-form-item>
        <n-form-item label="Tags" path="tags">
          <n-select
            label-field="title"
            value-field="_id"
            filterable
            multiple
            v-model:value="formValue.tags"
            tag
            :options="tags"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-popconfirm @positive-click="deleteNote">
          <template #trigger>
            <n-button type="error">
              <template #icon>
                <Delete24Filled />
              </template>
              Delete
            </n-button>
          </template>
          Are you sure you want to delete this note?
        </n-popconfirm>
        <n-button type="success" @click="handleSave">
          <template #icon>
            <Save24Filled />
          </template>
          Save
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { useAsyncData, useRuntimeConfig } from "#app";
import type { INoteRead, INoteWrite, ITagRead } from "@b3-todo/api";
import { Delete24Filled, Save24Filled } from "@vicons/fluent";
import { useEventBus } from "@vueuse/core";
import {
  type FormInst,
  NButton,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NH1,
  NPopconfirm,
  NSelect,
  useMessage,
} from "naive-ui";
import { omit } from "naive-ui/es/_utils";
import { ref } from "vue";
import useApi from "~/composables/useApi";
import useUtils from "~/composables/useUtils";

const { UPLOADS_BASE_URL } = useRuntimeConfig().public;

const { client } = useApi();

const show = defineModel<boolean>({ required: true });
const message = useMessage();
const { objectDiff } = useUtils();

const { note } = defineProps<{
  note: INoteRead;
}>();
const emit = defineEmits(["deleted", "updated", "state-updated"]);

const stateOptions = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const rules = {
  title: [{ required: true }],
  description: [{ required: true }],
  cover: [{ required: false }],
  dueDate: [{ required: false }],
};
const formRef = ref<FormInst>();
const formValue = ref<Omit<INoteWrite, "tags"> & { tags: string[] }>({
  ...omit(note, ["_id", "createdAt", "updatedAt", "__v", "tags"]),
  tags: note.tags?.map((tag) => tag._id.toString()) || [],
});

const deleteNote = async () => {
  const res = await client.notes.delete(note._id);

  if (!res.success) {
    message.error(res.error);
    return;
  }

  message.success("Note deleted successfully");
  useEventBus(`refresh:notes/${note.state}`).emit();
};

const { data: tags, refresh: refreshTags } = await useAsyncData(
  `tags/${note._id}`,
  async () => {
    const tags = await client.tags.list();
    if (!tags.success) {
      message.error(tags.error);
      return [];
    }
    return tags.data.results;
  },
  {
    default: () => [] as ITagRead[],
  },
);

const handleSave = async () => {
  if (!formRef.value?.validate()) {
    return;
  }

  const diff = objectDiff(
    formValue.value,
    omit(note, ["_id", "createdAt", "updatedAt", "__v"]),
  );

  if (Object.keys(diff).length === 0) {
    message.info("No changes detected");
    return;
  }

  if (diff.tags) {
    const existingTags = tags.value.map((tag) => tag._id.toString());
    for (let i = 0; i < diff.tags.length; i++) {
      if (!existingTags.includes(diff.tags[i])) {
        const newTagRes = await client.tags.create({
          title: diff.tags[i],
        });
        if (newTagRes.success) {
          diff.tags[i] = newTagRes.data._id.toString();
        } else {
          message.error(`Failed to create tag: ${diff.tags[i]}`);
          return;
        }
      }
    }
  }

  const res = await client.notes.update(note._id, diff);

  if (!res.success) {
    message.error(res.error);
    return;
  }

  message.success("Note updated successfully");
  show.value = false;
  if (diff.tags) refreshTags();
  if (diff.state) {
    console.log(note.state, diff.state);

    useEventBus(`refresh:notes/${note.state}`).emit();
    useEventBus(`refresh:notes/${diff.state}`).emit();
  }
  emit("updated");
};
</script>
