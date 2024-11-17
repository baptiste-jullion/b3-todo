<template>
  <n-spin :show="status == 'pending'" content-class="h-full">
    <n-card
      ref="el"
      class="relative flex h-full w-96"
      content-class="flex flex-col gap-4 relative"
      :header-class="`sticky top-0 z-10 ${top < 0 ? 'shadow-lg bg-[var(--n-color)] ' : ''}`"
      :title="`${state?.replaceAll('_', ' ').toUpperCase()} (${notes?.count || 0})`"
    >
      <slot name="before" />
      <NoteCard
        v-for="note in notes?.results"
        :note-id="note._id"
        @state-updated="refresh"
        :key="note._id"
      />
      <n-button v-if="hasMore" @click="refresh()" type="primary" class="w-full">
        Load More
      </n-button>
      <slot name="after" />
    </n-card>
  </n-spin>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";
import type { INoteRead } from "@b3-todo/api";
import { useElementBounding, useEventBus } from "@vueuse/core";
import { NButton, NCard, NSpin } from "naive-ui";
import { computed, ref } from "vue";
import NoteCard from "~/components/Note/Card.vue";
import useApi from "~/composables/useApi";

const { state } = defineProps<{
  state: INoteRead["state"];
}>();

const el = ref<HTMLElement | null>(null);

const { client } = useApi();
const bus = useEventBus(`refresh:notes/${state}`);
const { top } = useElementBounding(el);

const {
  data: notes,
  refresh,
  status,
} = await useAsyncData(`notes/${state}`, async () => {
  const res = await client.notes.list({
    fields: ["_id"],
    filter: {
      state,
    },
    pagination: {
      limit: 100,
    },
  });
  if (!res.success) {
    throw new Error(res.error);
  }

  return res.data;
});

const hasMore = computed(() => notes.value?.has_next || false);

bus.on(() => refresh());
</script>
