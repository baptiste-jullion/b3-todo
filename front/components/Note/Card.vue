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
              <n-avatar :src="src" />
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

const { api } = useApi();

const { noteId } = defineProps<{
  noteId: INoteRead["_id"];
}>();
const emit = defineEmits(["state-updated"]);

const { data: note, refresh } = await useAsyncData(noteId, async () => {
  const res = await api.notes.get(noteId);

  if (!res.success) {
    throw new Error(res.error);
  }
  return res.data;
});

const timeAgo = useTimeAgo(computed(() => note.value?.dueDate || new Date()));

const showDrawer = ref(false);

const users = [
  {
    name: "Leonardo DiCaprio",
    src: "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
  },
  {
    name: "Jennifer Lawrence",
    src: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
  },
  {
    name: "Audrey Hepburn",
    src: "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
  },
  {
    name: "Anne Hathaway",
    src: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
  },
  {
    name: "Taylor Swift",
    src: "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
  },
];
</script>
