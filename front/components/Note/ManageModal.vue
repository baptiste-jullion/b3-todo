<template>
  <n-modal v-model:show="showModal" class="max-w-xl">
    <n-card :title="formValue.title || 'New note...'">
      <n-form ref="formRef" :model="formValue" :rules>
        <n-form-item label="Title" path="title">
          <n-input v-model:value="formValue.title" />
        </n-form-item>
        <n-form-item label="Description" path="description">
          <n-input
            v-model:value="formValue.description"
            type="textarea"
            maxlength="500"
            show-count
          />
        </n-form-item>
        <TagsSelectInput v-model="formValue.tags" />
        <n-form-item label="Cover" path="cover">
          <n-upload
            v-if="!formValue.cover"
            directory-dnd
            action="#"
            accept="image/*"
            @finish="handleFinish"
            :max="1"
            :show-file-list="false"
          >
            <n-upload-dragger
              class="flex aspect-video items-center justify-center"
            >
              <ImageAdd24Filled class="size-16" />
            </n-upload-dragger>
          </n-upload>
          <div
            v-else
            class="relative w-full rounded-sm border border-dashed bg-black/5"
          >
            <img
              class="aspect-video w-full object-cover object-center"
              :src="formValue.cover"
            />
            <n-button
              class="absolute right-2 top-2"
              type="error"
              size="small"
              @click="formValue.cover = null"
            >
              <template #icon>
                <Delete24Filled />
              </template>
            </n-button>
          </div>
        </n-form-item>
        <n-form-item
          label="Due Date"
          path="dueDate"
          :feedback="formValue.dueDate ? timeAgo : ''"
        >
          <n-date-picker
            v-model:value="formValue.dueDate"
            type="datetime"
            clearable
            class="w-full"
          />
        </n-form-item>
        <n-form-item label="Tasks" path="tasks">
          <n-dynamic-input
            v-model:value="formValue.tasks"
            placeholder="New task..."
            show-sort-button
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="handleValidateClick"> Validate </n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import type { INoteWrite } from "@b3-todo/api";
import { Delete24Filled, ImageAdd24Filled } from "@vicons/fluent";
import { useEventBus, useTimeAgo } from "@vueuse/core";
import {
  type FormInst,
  NButton,
  NCard,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NUpload,
  NUploadDragger,
  NDynamicInput,
  type UploadFileInfo,
  useMessage,
} from "naive-ui";
import { computed, ref } from "vue";
import TagsSelectInput from "~/components/Tags/SelectInput.vue";
import useApi from "~/composables/useApi";

const { api } = useApi();

const showModal = defineModel<boolean>({ required: true });
const { initialValues } = defineProps<{
  initialValues?: INoteWrite;
}>();

const message = useMessage();

const defaultValues: INoteWrite = {
  title: "",
  description: "",
  cover: undefined,
  dueDate: undefined,
  tasks: [""],
};
const rules = {
  title: [{ required: true }],
  description: [{ required: true }],
  cover: [{ required: false }],
  dueDate: [{ required: false }],
};
const formRef = ref<FormInst>();
const formValue = ref<INoteWrite>(initialValues || defaultValues);
const resetForm = () => {
  formValue.value = defaultValues;
  formRef.value?.restoreValidation();
};

const timeAgo = useTimeAgo(
  computed(() => formValue.value.dueDate || new Date()),
);

const handleFinish = ({ file }: { file: Required<UploadFileInfo> }) => {
  if (file.url) {
    formValue.value.cover = file.url;
  } else if (file.file) {
    const reader = new FileReader();
    reader.onload = () => {
      formValue.value.cover = reader.result as string;
    };
    reader.readAsDataURL(file.file as Blob);
  }
};

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate(async (err) => {
    if (err) {
      message.error("Form validation failed");
    } else {
      const res = await api.notes.create(formValue.value);

      if (!res.success) {
        message.error("An error occurred");
        return;
      }

      message.success("Note created");
      resetForm();
      showModal.value = false;
      useEventBus("refresh:notes/todo").emit();
    }
  });
};
</script>
