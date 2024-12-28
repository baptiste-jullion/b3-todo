<template>
  <n-modal
    v-model:show="show"
    :title="note.title"
    preset="card"
    class="max-w-xl"
  >
    <n-text>
      {{ note.description }}
    </n-text>
    <!-- <n-select :options="stateOptions" v-model:value="formValue.state" />
      <TagsSelectInput v-model="formValue.tags" /> -->
    <n-table size="small" v-if="tasks">
      <thead>
        <tr>
          <th>
            <div class="flex items-center">
              <ClipboardTaskListLtr20Filled class="size-6" />
              <span>Tasks</span>
              <span class="ml-auto">
                <sup>{{ tasks.completed }}</sup
                >/<sub>{{ tasks.total }}</sub>
              </span>
            </div>
            <n-progress
              class="mt-2"
              :percentage="tasks.percentage"
              :show-indicator="false"
              :status="tasks.isCompleted ? 'success' : 'info'"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in note.tasks">
          <td>
            <n-checkbox
              :label="task.label"
              v-model:checked="task.completed"
              @update:checked="handleCheck(task._id, $event)"
              class="w-full [&>span]:w-full"
            />
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-modal>
</template>

<script setup lang="ts">
import type { INoteRead, ITagRead, ITaskRead } from "@b3-todo/api";
import { ClipboardTaskListLtr20Filled } from "@vicons/fluent";
import {
  NCheckbox,
  NModal,
  NProgress,
  NTable,
  NText,
  useMessage,
} from "naive-ui";
import useApi from "~/composables/useApi";
import useUtils from "~/composables/useUtils";

const { api } = useApi();
const { calculatePercentage } = useUtils();

import { computed } from "vue";
import { useAsyncData } from "#app";
const show = defineModel<boolean>({ required: true });
const message = useMessage();

const { note } = defineProps<{
  note: INoteRead;
}>();
const emit = defineEmits(["deleted", "updated", "state-updated"]);

const tasks = computed(() => calculatePercentage(note.tasks, "completed"));

const { refresh: refreshTags } = await useAsyncData(
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

const handleCheck = async (taskId: ITaskRead["_id"], state: boolean) => {
  state ? await api.notes.tasks.complete(taskId) : await api.notes.tasks.uncomplete(taskId);
  console.log("Task checked", taskId, state);
};
</script>
