<template>
  <section class="flex gap-4">
    <NoteViewGridColumn v-for="state in states" :key="state" :state>
      <template #before v-if="state === 'todo'">
        <NoteViewGridAddButton />
  </template>
    </NoteViewGridColumn>
  </section>
</template>

<script setup lang="ts">
import type { INoteRead } from "@b3-todo/api";
import NoteViewGridColumn from "~/components/Note/View/Grid/Column.vue";
import NoteViewGridAddButton from "~/components/Note/View/Grid/AddButton.vue";

const states = ["todo", "in_progress", "completed"] as INoteRead["state"][];
</script>
