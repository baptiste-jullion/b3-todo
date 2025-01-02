<template>
  <n-card
    v-if="note"
    draggable
    size="small"
    :title="note.title"
    embedded
    hoverable
    class="cursor-pointer"
    @click="showDetails = true"
  >
    <n-text class="mb-2 line-clamp-3" :title="note.description">
      {{ note.description }}
    </n-text>
    <n-tooltip v-if="note.dueDate" trigger="hover" placement="bottom-start">
      <template #trigger>
        <n-tag
          :type="note.dueDate < new Date().getTime() ? 'warning' : 'success'"
        >
          {{ new Date(note.dueDate).toLocaleDateString() }}
          <template #icon>
            <n-icon :component="Clock24Regular" />
          </template>
        </n-tag>
      </template>
      {{ timeAgo }}
    </n-tooltip>
    <div class="flex flex-wrap gap-0.5" v-if="note.tags?.length">
      <n-tag v-for="tag in note.tags" type="info">
        {{ tag.title }}
      </n-tag>
    </div>
    <div class="flex items-center justify-between pt-4">
      <div v-if="tasks" class="flex items-center gap-2">
        <n-progress
          type="circle"
          :offset-degree="180"
          class="!w-4"
          :stroke-width="24"
          :status="tasks.isCompleted ? 'success' : 'info'"
          :show-indicator="false"
          :percentage="tasks.percentage"
        />
        <small>
          <sup>{{ tasks.completed }}</sup
          >/<sub>{{ tasks.total }}</sub> tasks
        </small>
      </div>
      <div v-else></div>
      <n-avatar-group :options="users" :size="32">
        <template #avatar="{ option: { name, src } }">
          <n-tooltip>
            <template #trigger>
              <n-avatar :src />
            </template>
            {{ name }}
          </n-tooltip>
        </template>
      </n-avatar-group>
    </div>
    <note-details :note v-model="showDetails" @updated="refresh"  />
  </n-card>
</template>

<script setup lang="ts">
import type { INoteRead } from "@b3-todo/api-sdk";
import { Clock24Regular } from "@vicons/fluent";
import { useTimeAgo } from "@vueuse/core";
import { toSvg } from "jdenticon";
import {
  NAvatar,
  NAvatarGroup,
  NCard,
  NIcon,
  NProgress,
  NTag,
  NText,
  NTooltip,
} from "naive-ui";
import { computed, ref } from "vue";
import NoteDetails from "~/components/Note/Details.vue";
import useApi from "~/composables/useApi";
import useUtils from "~/composables/useUtils";
import { useAsyncData } from "#app";

const { api, handleAPIResponse } = useApi();
const { calculatePercentage } = useUtils();

const { noteId } = defineProps<{
  noteId: INoteRead["_id"];
}>();
const emit = defineEmits(["state-updated"]);

const { data: note, refresh } = await useAsyncData(noteId, async () =>
  handleAPIResponse(await api.notes.get(noteId)),
);

const timeAgo = useTimeAgo(computed(() => note.value?.dueDate || new Date()));
const tasks = computed(() =>
  calculatePercentage(note.value?.tasks, "completed"),
);

const showDetails = ref(false);

const getAvatarUrl = (src: string) => {
  return `data:image/svg+xml,${encodeURIComponent(toSvg(src, 32))}`;
};

const users = computed(() => {
  const u = [
    {
      name: note.value?.author?.username,
      src: getAvatarUrl(note.value?.author.username || ""),
    },
  ];

  if (!note.value?.tasks) return u;
  for (const task of note.value.tasks) {
    if (task.completedBy) {
      u.push({
        name: task.completedBy.username,
        src: getAvatarUrl(task.completedBy.username),
      });
    }
  }

  return Array.from(new Set(u.map((u) => u.name))).map((name) =>
    u.find((u) => u.name === name),
  );
});
</script>
