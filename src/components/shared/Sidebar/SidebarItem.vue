<script setup lang="ts">
import { FunctionalComponent, ref } from "vue";
import { LucideProps } from "lucide-vue-next";

interface SidebarItemProps {
  currentPath: string;
  icon: FunctionalComponent<LucideProps, {}, any, {}>;
  title: string;
  path: string;
}

defineProps<SidebarItemProps>();

const tooltipVisible = ref<boolean>(false);
</script>

<template>
  <RouterLink
    @mouseenter="tooltipVisible = true"
    @mouseleave="tooltipVisible = false"
    :key="path"
    :to="path"
    :class="[
      'flex items-center justify-center lg:justify-stretch gap-3 lg:px-5 lg:py-2.5 text-sm font-semibold hover:bg-[#F5F5F7] rounded-lg-max size-10 lg:w-full transition-colors',
      currentPath === path
        ? 'text-main-black bg-[#F5F5F7]'
        : 'text-[#8E92BC] bg-white',
    ]"
  >
    <component :is="icon" class="size-6" />
    <p
      :class="[
        'block lg:hidden absolute whitespace-nowrap px-2.5 rounded-lg left-[60px] bg-main-purple-500 text-white z-30 py-1 font-semibold text-xs transition-all',
        tooltipVisible
          ? 'opacity-100 translate-x-0'
          : '-translate-x-10 opacity-0 pointer-events-none',
      ]"
    >
      {{ title }}
    </p>
    <p class="hidden lg:block">{{ title }}</p>
  </RouterLink>
</template>
