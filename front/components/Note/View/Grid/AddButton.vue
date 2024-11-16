<template>
  <n-tooltip placement="bottom" trigger="hover" :delay="1000">
    <template #trigger>
      <n-button class="h-12 w-full" dashed @click="showModal = true">
        <template #icon>
          <Add24Filled />
        </template>
        <NoteManageModal v-model="showModal" @created="bus.emit()" />
      </n-button>
    </template>
    Create a new note
  </n-tooltip>
</template>

<script setup lang="ts">
import { Add24Filled } from "@vicons/fluent";
import { NButton, NTooltip } from "naive-ui";
import { ref } from "vue";
import NoteManageModal from "~/components/Note/ManageModal.vue";
import {useEventBus}from "@vueuse/core"

const showModal = ref(false);

const bus = useEventBus("refresh:notes/todo");
</script>
