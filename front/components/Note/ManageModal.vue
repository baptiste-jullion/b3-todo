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
import { useEventBus, useTimeAgo } from "@vueuse/core";
import {
  type FormInst,
  NButton,
  NCard,
  NDatePicker,
  NDynamicInput,
  NForm,
  NFormItem,
  NInput,
  NModal,
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
  dueDate: undefined,
  tasks: [""],
};
const rules = {
  title: [{ required: true }],
  description: [{ required: true }],
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
