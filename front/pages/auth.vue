<template>
  <section class="grid min-h-screen w-full place-items-center">
    <n-card class="h-fit max-w-lg">
      <n-tabs default-value="login" type="segment">
        <n-tab-pane name="login" tab="Login">
          <n-form
            ref="formRef"
            class="w-full max-w-lg"
            :model="formValue"
            :rules="rules"
          >
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
              <n-button
                class="w-full"
                type="primary"
                secondary
                @click="handleValidateForm($event, 'login')"
              >
                Login
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="register" tab="Register">
          <n-form
            ref="formRef"
            class="w-full max-w-lg"
            :model="formValue"
            :rules="rules"
          >
            <n-form-item label="Username" path="username">
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
              <n-button
                class="w-full"
                type="primary"
                secondary
                @click="handleValidateForm($event, 'register')"
              >
                Register
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </section>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import type { IUserWrite } from "@b3-todo/api";
import {
  type FormInst,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NTabPane,
  NTabs,
  useMessage,
} from "naive-ui";
import { ref } from "vue";
import useApi from "~/composables/useApi";

const message = useMessage();
const { api } = useApi();

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

const handleValidateForm = async (e: MouseEvent, mode: "login" | "register") => {
  e?.preventDefault();
  formRef.value?.validate(async (err) => {
    if (err) {
      message.error("Form validation failed");
    } else {
      if (mode === "login") {
        const res = await api.auth.login(formValue.value);

        if (!res.success) {
          message.error("An error occurred");
          return;
        }

        message.success("User logged in successfully");
        resetForm();

        navigateTo("/");
      } else {
        const res = await api.auth.register(formValue.value);

        if (!res.success) {
          message.error("An error occurred");
          return;
        }

        message.success("User created successfully");
        resetForm();

        navigateTo("/");
      }
    }
  });
};
</script>
