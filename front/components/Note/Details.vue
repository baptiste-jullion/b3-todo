<template>
  <n-modal
    v-model:show="show"
    :title="note.title"
    preset="card"
    class="max-w-xl"
  >
    <n-select
      class="mb-3"
      v-model:value="note.state"
      :options="[
        {
          label: 'Todo',
          value: 'todo',
        },
        {
          label: 'In Progress',
          value: 'in_progress',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ]"
      @update:value="handleStateUpdate(note._id, $event)"
    >
    </n-select>
    <div v-if="note.tags?.length" class="mb-3 flex flex-wrap gap-2">
      <n-tag v-for="tag in note.tags" type="info">
        {{ tag.title }}
      </n-tag>
    </div>
    <n-text tag="p" class="mb-2">
      {{ note.description }}
    </n-text>
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
              :class="[
                'w-full [&>span]:w-full',
                {
                  '[&>span]:line-through': task.completed,
                },
              ]"
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
  NTag,
  NText,
  NSelect,
  useMessage,
} from "naive-ui";
import useApi from "~/composables/useApi";
import useUtils from "~/composables/useUtils";

const { api } = useApi();
const { calculatePercentage } = useUtils();

import { useAsyncData } from "#app";
import { computed } from "vue";
import { useEventBus } from "@vueuse/core";
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
  const res = state
    ? await api.notes.tasks.complete(taskId)
    : await api.notes.tasks.uncomplete(taskId);
  if (!res.success) {
    message.error(res.error);
    return;
  }
  emit("updated");
};

const handleStateUpdate = async (
  noteId: INoteRead["_id"],
  state: "todo" | "in_progress" | "completed",
) => {
  const res = await api.notes.update(noteId, { state });
  if (!res.success) {
    message.error(res.error);
    return;
  }
  message.success("Note state updated");
  useEventBus("refresh:notes/todo").emit();
  useEventBus("refresh:notes/in_progress").emit();
  useEventBus("refresh:notes/completed").emit();
};
</script>
