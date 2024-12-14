<script setup lang="ts">
import { useRoute } from "vue-router";

import SidebarItem from "./SidebarItem.vue";

import { navLinks } from "@/constants/nav";

const route = useRoute();
</script>

<template>
  <aside
    class="lg:w-[252px] h-screen sticky top-0 border-r border-[#F5F5F7] p-3.5 lg:p-8 flex gap-4 flex-col"
  >
    <div class="flex flex-col gap-14">
      <div class="flex justify-center lg:justify-stretch items-center gap-3">
        <div class="size-10 flex-center">
          <img src="@/assets/logo.svg" class="size-full lg:size-[36px]" />
        </div>
        <h1
          class="text-[2rem] leading-snug text-main-black font-semibold hidden lg:block"
        >
          Jeret
        </h1>
      </div>
      <nav class="w-full flex flex-col gap-6">
        <SidebarItem
          v-for="link in navLinks"
          :key="link.path"
          v-bind:="link"
          :current-path="route.path"
        />
      </nav>
    </div>
    <div class="mt-auto relative hidden lg:block">
      <div
        class="border-4 border-white rounded-full size-12 text-white flex-center font-bold text-[1.75rem] absolute bg-main-black z-20 left-1/2 -translate-y-1/2 -translate-x-1/2"
      >
        ?
      </div>
      <div
        class="size-12 bg-[#54577A] blur-lg rounded-full absolute left-1/2 -translate-y-1/2 top-2.5 -translate-x-1/2 z-10"
      ></div>
      <div
        class="relative h-[248px] w-full bg-main-black rounded-lg-max overflow-hidden p-4 pt-[70px] flex flex-col"
      >
        <div class="text-white text-center">
          <h3 class="text-base font-semibold">Help Center</h3>
          <p class="text-xs font-medium mt-3">
            Having Trouble in Learning. Please contact us for more questions.
          </p>
        </div>
        <RouterLink
          to="#"
          class="mt-auto z-10 h-10 text-main-black bg-white rounded-lg-max flex-center text-xs font-semibold"
        >
          Go To Help Center
        </RouterLink>
        <div
          class="size-[160px] rounded-full bg-white/[0.08] absolute top-0 left-0 -translate-x-[60%] -translate-y-[62.5%]"
        />
        <div
          class="size-[160px] rounded-full bg-white/[0.08] absolute bottom-0 right-0 translate-x-[55%] translate-y-1/2"
        />
      </div>
    </div>
  </aside>
</template>
