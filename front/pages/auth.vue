<template>
  <section
    class="grid min-h-screen w-full grid-cols-1 *:transition-transform lg:grid-cols-2"
  >
    <div
      class="size-full p-8 pr-4 max-lg:hidden"
      @mouseenter="regenerateAbstractClass"
      :style="{
        transform:
          mode == 'login' ? 'translateX(0)' : 'translateX(calc(100% - 1rem))',
      }"
    >
      <button
        class="abstract overflow-hidden rounded-xl"
        :style="abstractStyles"
        @click="mode = mode == 'login' ? 'register' : 'login'"
      >
        {{ mode == "register" ? "Login" : "Register" }}
      </button>
    </div>
    <div
      class="flex size-full items-center justify-center p-8 pl-4"
      :style="{
        transform:
          mode == 'login' ? 'translateX(0)' : 'translateX(calc(-100% + 1rem))',
      }"
    >
      <n-form
        ref="formRef"
        class="w-full max-w-lg"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item v-if="mode == 'register'" label="Username" path="username">
          <n-input v-model:value="formValue.username" />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input v-model:value="formValue.email" />
        </n-form-item>
        <n-form-item label="Password" path="password">
          <n-input
            v-model:value="formValue.password"
            type="password"
            show-password-on="mousedown"
          />
        </n-form-item>
        <n-form-item>
          <n-button @click="handleValidateForm">
            {{ mode == "login" ? "Login" : "Register" }}
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { navigateTo, useCookie, useRuntimeConfig } from "#app";
import type { IUserWrite } from "@b3-todo/api";
import {
  type FormInst,
  NButton,
  NForm,
  NFormItem,
  NInput,
  useMessage,
} from "naive-ui";
import { reactive, ref } from "vue";
import useApi from "~/composables/useApi";

const message = useMessage();
const { api } = useApi();
const cookie = useCookie(useRuntimeConfig().public.JWT_COOKIE_NAME, {
  sameSite: "strict",
  maxAge: 3600,
});

const mode = ref<"login" | "register">("login");
const rules = {
  username: [{ required: true }],
  email: [{ required: true }],
  password: [{ required: true }],
};
const defaultValues = {
  username: "",
  email: "",
  password: "",
};
const formRef = ref<FormInst>();
const formValue = ref<IUserWrite>(defaultValues);
const resetForm = () => {
  formValue.value = defaultValues;
  formRef.value?.restoreValidation();
};

const handleValidateForm = async (e: MouseEvent) => {
  e?.preventDefault();
  formRef.value?.validate(async (err) => {
    if (err) {
      message.error("Form validation failed");
    } else {
      if (mode.value === "login") {
        const res = await api.auth.login(formValue.value);

        if (!res.success) {
          message.error("An error occurred");
          return;
        }

        cookie.value = res.data.token;

        message.success("User logged in successfully");
        resetForm();

        navigateTo("/");
      } else {
        const res = await api.auth.register(formValue.value);

        if (!res.success) {
          message.error("An error occurred");
          return;
        }

        cookie.value = res.data.token;

        message.success("User created successfully");
        resetForm();

        navigateTo("/");
      }
    }
  });
};

const abstractStyles = reactive({
  background: "",
});

const generateAbstractClass = () => {
  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const randomColor = () => {
    const randomHex = () =>
      Math.floor(random(100, 255)).toString(16).padStart(2, "0");
    return `#${randomHex()}${randomHex()}${randomHex()}`;
  };

  const gradients = Array.from({ length: 15 }, () => {
    const xPos = `${random(0, 100).toFixed(0)}%`;
    const yPos = `${random(0, 100).toFixed(0)}%`;
    const color = randomColor();
    return `radial-gradient(at ${xPos} ${yPos}, ${color} 0px, transparent 50%)`;
  });

  abstractStyles.background = `${gradients.join(", ")} #101014`;
};

generateAbstractClass();

const regenerateAbstractClass = () => {
  generateAbstractClass();
};
</script>

<style scoped>
.abstract {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.abstract::before {
  content: "";
  background-color: transparent;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 100px;
  opacity: 0.2;
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
