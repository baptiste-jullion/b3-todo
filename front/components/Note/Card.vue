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
    <div class="flex justify-end pt-4">
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

const { data: note, refresh } = await useAsyncData(noteId, async () => {
  return handleAPIResponse(await api.notes.get(noteId));
});

const timeAgo = useTimeAgo(computed(() => note.value?.dueDate || new Date()));

const showDrawer = ref(false);

const getAvatarUrl = (src: string) => {
  return `data:image/svg+xml,${encodeURIComponent(toSvg(src, 32))}`;
};

const users = computed(() => {
  return [
    {
      name: note.value?.author?.username,
      src: getAvatarUrl(note.value?.author?.username),
    },
  ];
});
</script>
