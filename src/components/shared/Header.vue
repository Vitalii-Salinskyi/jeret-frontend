<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { useSessionStore } from "@/stores/sessionStore";

import Avatar from "../ui/Avatar.vue";

import { Bell } from "lucide-vue-next";

import { navLinks } from "@/constants/nav";

import { HeaderVariant } from "@/interfaces";

export interface HeaderProps extends HeaderVariant {
  sectionName: string;
}

const sessionStore = useSessionStore();
const route = useRoute();

const isMenuOpen = ref<boolean>(false);

defineProps<HeaderProps>();
</script>

<template>
  <header class="bg-white relative">
    <!-- Menu -->
    <div
      :class="{
        'fixed inset-0 top-[110px] bg-white z-20 transition-transform duration-300': true,
        'translate-y-0': isMenuOpen,
        '-translate-y-[150%]': !isMenuOpen,
      }"
    >
      <nav class="mx-auto flex flex-col items-center gap-3 w-full h-full px-6">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          @click="isMenuOpen = false"
          :class="[
            'w-full h-12  hover:text-white px-3 flex items-center gap-4 rounded-2xl hover:bg-main-purple-400 transition-colors text-lg',
            route.path.includes(link.path)
              ? '!bg-main-purple-400 !text-white'
              : 'text-main-purple-400  bg-transparent',
          ]"
        >
          <component :is="link.icon"></component>
          {{ link.title }}
        </RouterLink>
      </nav>
    </div>
    <!-- /Menu -->
    <div class="absolute -left-px bg-white top-0 bottom-0 h-full w-px" />
    <div class="flex flex-col gap-6 px-6 md:px-8 py-8">
      <div class="flex items-center justify-between">
        <div
          class="rounded-full border border-[#8E92BC] size-11 cursor-pointer flex-center sm:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <div
            :class="{
              'tham tham-e-spin tham-w-5 hover:opacity-100': true,
              'tham-active': isMenuOpen,
            }"
          >
            <div class="tham-box">
              <div class="tham-inner bg-[#8E92BC]" />
            </div>
          </div>
        </div>
        <div class="hidden sm:flex flex-col gap-3">
          <h2 class="text-2xl text-main-black font-semibold">
            {{
              sectionName === "Dashboard"
                ? title + ` ${sessionStore.user?.name}`
                : title
            }}
          </h2>
          <p class="text-[#54577A] font-medium text-base" v-if="subtitle">
            {{ subtitle }}
          </p>
        </div>
        <div class="flex items-center gap-6">
          <div
            class="size-[52px] flex-center rounded-full border border-[#F5F5F7] cursor-pointer"
          >
            <div class="relative">
              <div
                class="size-2 rounded-full bg-[#FF4D5E] absolute top-0 right-0.5 z-10"
              />
              <Bell class="text-[#8E92BC] relative size-[22px]"></Bell>
            </div>
          </div>
          <Avatar
            v-if="sessionStore.user"
            :src="
              sessionStore.user.profile_picture
                ? sessionStore.user.profile_picture
                : ''
            "
            :alt="sessionStore.user.name"
            :name="sessionStore.user.name"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2 sm:hidden">
        <h2 class="text-2xl text-main-black font-semibold">
          {{
            sectionName === "Dashboard"
              ? title + ` ${sessionStore.user?.name}`
              : title
          }}
        </h2>
        <p class="text-[#54577A] font-medium text-sm" v-if="subtitle">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </header>
</template>
