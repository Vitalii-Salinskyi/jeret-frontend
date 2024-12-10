<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/ui/button/Button.vue";
import AuthInput from "./AuthInput.vue";

const isLogin = ref(true);
</script>

<template>
  <form class="flex flex-col max-w-[360px] w-full gap-8">
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
          id="name-input"
          label="Name"
          placeholder="Enter your name"
          autocomplete="name"
          autofocus
          required
        />
        <AuthInput
          id="email-input"
          label="Email"
          placeholder="Enter your email"
          type="email"
          autocomplete="email"
          required
        />
        <AuthInput
          id="password-input"
          label="Password"
          placeholder="Enter your password"
          type="password"
          autocomplete="password"
          required
        />
      </div>
      <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <div
            class="inline-flex gap-2 items-center cursor-pointer"
            v-if="isLogin"
          >
            <Checkbox id="remember-checkbox" />
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
        <div class="flex flex-col gap-4 font-medium">
          <Button class="text-base">
            {{ isLogin ? "Sign in" : "Sign up" }}
          </Button>
          <Button
            class="items-center text-main-black bg-transparent hover:bg-transparent text-base shadow-none border border-[#DADADA]"
          >
            <img
              src="@/assets/icons/auth/google.svg"
              alt="Google"
              width="24"
              height="24"
            />
            Sign in with Google
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
        type="button"
        class="text-main-purple-400"
      >
        {{ isLogin ? "Sign up" : "Sing in" }}
      </button>
    </div>
  </form>
</template>
