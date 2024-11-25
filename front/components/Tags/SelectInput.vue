<template>
  <n-form-item label="Tags" path="tags">
    <n-select
      label-field="title"
      value-field="_id"
      filterable
      multiple
      v-model:value="model"
      tag
      :options="tags"
    />
  </n-form-item>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";
import type { ITagRead } from "@b3-todo/api";
import { NFormItem, NSelect, useMessage } from "naive-ui";
import type { Value } from "naive-ui/es/select/src/interface";
import useApi from "~/composables/useApi";

const { api } = useApi();
const message = useMessage();

const model = defineModel<Value | undefined>({ required: true });

const { data: tags } = await useAsyncData(
  "tags",
  async () => {
    const tags = await api.tags.list();
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
</script>
