<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useField, useForm } from "vee-validate";
import { useToast } from "@/components/ui/toast";

import Button from "@/components/ui/button/Button.vue";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/ui/Spinner.vue";
import AuthInput from "./AuthInput.vue";

import { loginSchema, registerSchema } from "@/schemas/auth";

import { setTokens } from "@/utils/tokens";

import { getUserLocationAndDeviceInfo, login, register } from "@/api/auth";

import { AuthForm, CreateSessionDto, AuthTokens } from "@/interfaces/auth";

const initialValues: AuthForm = {
  email: "",
  password: "",
  name: "",
};

const { toast } = useToast();
const router = useRouter();

const isLogin = ref<boolean>(false);
const termsConsent = ref<boolean>(false);
const remember = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const validationSchema = computed(() =>
  isLogin ? loginSchema : registerSchema
);

const { handleSubmit, errors, resetForm } = useForm<AuthForm>({
  validationSchema,
  initialValues,
});

const { value: name, meta: nameMeta } = useField("name");
const { value: email, meta: emailMeta } = useField("email");
const { value: password, meta: passwordMeta } = useField("password");

const onSubmit = handleSubmit(async ({ email, password, name }) => {
  isLoading.value = true;

  try {
    let res;

    if (isLogin.value === false) {
      if (!termsConsent.value) {
        toast({
          title: "Terms and Conditions Required",
          description: "Please accept the terms and conditions to proceed.",
          variant: "destructive",
        });
        return;
      }
      res = await register({ email, password, name: name as string });
    } else {
      const locationAndDevice = await getUserLocationAndDeviceInfo();

      if (locationAndDevice.error) {
        toast({
          title: "Authentication Failed",
          description: locationAndDevice.error,
          variant: "destructive",
        });
        return;
      }

      res = await login({
        loginDto: { email, password },
        createSessionDto: locationAndDevice as CreateSessionDto,
      });
    }

    if (res.status === "failure") {
      toast({
        title: isLogin ? "Login Failed" : "Registration Failed",
        description: res.data,
        variant: "destructive",
      });
      return;
    }

    if (isLogin.value) {
      router.push("/");
      setTokens(res.data as AuthTokens);
    } else {
      toast({
        title: "Account created successfully",
        description:
          "Your account has been successfully created. You can now log in.",
      });
      isLogin.value = true;
      resetForm({
        values: initialValues,
      });
    }
  } finally {
    isLoading.value = false;
  }
});

const handleGoogleRedirect = () => {
  const serverUri = import.meta.env.VITE_SERVER_URL;
  window.location.replace(`${serverUri}/auth/google`);
};

watch(
  () => isLogin.value,
  () => resetForm({ values: initialValues }),
  { immediate: true }
);
</script>

<template>
  <form class="flex flex-col max-w-[360px] w-full gap-8" @submit="onSubmit">
    <div class="flex flex-col gap-3 text-center md:text-left">
      <h1 class="text-[2.625rem] leading-tight text-main-black">
        {{ isLogin ? "Welcome back" : "Create Account" }}
      </h1>
      <p class="text-base text-[#808080] tracking-wide">
        {{
          isLogin
            ? "Welcome back! Please enter your details."
            : "Join us and get started with all the features."
        }}
      </p>
    </div>
    <div class="flex flex-col gap-5">
      <div class="flex flex-col gap-3">
        <AuthInput
          v-if="!isLogin"
          v-model="name"
          :error="nameMeta.dirty && errors.name ? errors.name : ''"
          id="name-input"
          label="Name"
          placeholder="Enter your name"
          autocomplete="name"
          name="name"
          autofocus
          required
        />
        <AuthInput
          v-model="email"
          :error="emailMeta.dirty && errors.email ? errors.email : ''"
          id="email-input"
          label="Email"
          placeholder="Enter your email"
          type="email"
          name="email"
          autocomplete="email"
          required
        />
        <AuthInput
          v-model="password"
          :error="passwordMeta.dirty && errors.password ? errors.password : ''"
          id="password-input"
          label="Password"
          placeholder="Enter your password"
          type="password"
          name="password"
          autocomplete="password"
          required
        />
      </div>
      <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between" v-if="isLogin">
          <div class="inline-flex gap-2 items-center cursor-pointer">
            <Checkbox id="remember-checkbox" v-model:checked="remember" />
            <label
              for="remember-checkbox"
              class="cursor-pointer font-medium text-sm"
            >
              Remember for 30 days
            </label>
          </div>
          <RouterLink
            to="#"
            class="text-main-purple-400 font-semibold text-sm transition-transform duration-200 active:scale-[.98]"
          >
            Forgot Password
          </RouterLink>
        </div>
        <div class="flex items-center gap-2" v-else>
          <Checkbox id="terms-checkbox" v-model:checked="termsConsent" />
          <label
            for="terms-checkbox"
            class="cursor-pointer font-medium text-sm"
          >
            I agree with
            <span class="text-main-purple-500">Terms</span>
            and
            <span class="text-main-purple-500">Privacy</span>
          </label>
        </div>
        <div class="flex flex-col gap-4 font-medium">
          <Button class="text-base relative">
            <template v-if="!isLoading">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </template>
            <Spinner v-else color-class="fill-main-purple-800" />
          </Button>
          <Button
            type="button"
            class="items-center text-main-black bg-transparent hover:bg-transparent text-base shadow-none border border-[#DADADA]"
            @click="handleGoogleRedirect"
          >
            <img
              src="@/assets/icons/auth/google.svg"
              alt="Google"
              width="24"
              height="24"
            />
            {{ isLogin ? "Sign in" : "Sing up" }}
            with Google
          </Button>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-1 mx-auto font-medium text-sm">
      <p>
        {{ isLogin ? "Don’t have an account?" : "Already have an account?" }}
      </p>
      <button
        @:click="isLogin = !isLogin"
        :disabled="isLoading"
        type="button"
        class="text-main-purple-400"
      >
        {{ isLogin ? "Sign up" : "Sing in" }}
      </button>
    </div>
  </form>
</template>
