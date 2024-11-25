<template>
  <main class="p-8">
    <note-view-grid />
    <n-button
      type="error"
      secondary
      class="fixed right-8 top-8 z-10"
      @click="handleDisconnect"
    >
      Disconnect
      <template #icon>
        <PlugDisconnected24Regular />
      </template>
    </n-button>
  </main>
</template>

<script setup lang="ts">
import { PlugDisconnected24Regular } from "@vicons/fluent";
import { NButton } from "naive-ui";
import NoteViewGrid from "~/components/Note/View/Grid.vue";

import useAuth from "~/composables/useAuth";

const { disconnect } = useAuth();

const handleDisconnect = () => {
  disconnect();
};
</script>
