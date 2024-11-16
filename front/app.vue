<template>
  <n-config-provider
    :theme-overrides="{
      common: {
        borderRadius: '6px',
      },
    }"
    :theme="darkTheme"
  >
    <n-message-provider>
      <n-modal-provider>
        <NuxtPage />
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NModalProvider, darkTheme } from "naive-ui";

</script>

<style>
body {
  background: rgb(16, 16, 20);
}
</style>
