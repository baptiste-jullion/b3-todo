<template>
  <n-card
    v-if="note"
    draggable
    size="small"
    :title="note.title"
    embedded
    hoverable
    class="cursor-pointer"
    @click="showDrawer = true"
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
      <div v-if="note.tasks?.length" class="flex items-center gap-2">
        <n-progress
          type="circle"
          :offset-degree="180"
          class="!w-4"
          :stroke-width="24"
          status="success"
          :show-indicator="false"
          :percentage="tasks.completedPercentage"
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
    <NoteDetailsDrawer :note="note" v-model="showDrawer" @updated="refresh" />
  </n-card>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";
import type { INoteRead } from "@b3-todo/api";
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
import NoteDetailsDrawer from "~/components/Note/DetailsDrawer.vue";
import useApi from "~/composables/useApi";

const { api, handleAPIResponse } = useApi();

const { noteId } = defineProps<{
  noteId: INoteRead["_id"];
}>();
const emit = defineEmits(["state-updated"]);

const { data: note, refresh } = await useAsyncData(noteId, async () =>
  handleAPIResponse(await api.notes.get(noteId)),
);

const timeAgo = useTimeAgo(computed(() => note.value?.dueDate || new Date()));
const tasks = computed(() => {
  const res = {
    completed: note.value?.tasks?.filter((task) => task.completed).length || 0,
    total: note.value?.tasks?.length || 0,
    completedPercentage: 0,
  };

  res.completedPercentage = (res.completed / res.total) * 100;

  return res;
});

const showDrawer = ref(false);

const getAvatarUrl = (src: string) => {
  return `data:image/svg+xml,${encodeURIComponent(toSvg(src, 32))}`;
};

const users = computed(() => {
  return [
    {
      name: note.value?.author?.username,
      src: getAvatarUrl(note.value?.author.username || ""),
    },
  ];
});
</script>
