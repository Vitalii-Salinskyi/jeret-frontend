<script setup lang="ts">
import { X } from "lucide-vue-next";

interface FilterSidebarProps {
  isOpen: boolean;
  sidebarTitle: string;
}

defineProps<FilterSidebarProps>();

const emit = defineEmits<{
  (event: "on-close", isOpen: boolean): void;
}>();
</script>

<template>
  <div
    @click="emit('on-close', false)"
    :class="{
      'fixed size-full inset-0 flex justify-end transition-all z-10 sm:bg-black/10': true,
      'pointer-events-auto opacity-100': isOpen,
      'pointer-events-none opacity-0': !isOpen,
    }"
  >
    <aside
      @click.stop
      ref="sidebar-ref"
      :class="{
        'w-full sm:w-80 h-full bg-white border-r border-[#F5F5F7] shadow-sm drop-shadow-sm transition-all overflow-y-auto duration-300;': true,
        'translate-x-0': isOpen,
        'translate-x-full': !isOpen,
      }"
    >
      <header
        class="flex items-center justify-between px-7 py-6 text-main-black border-b border-[#F2F2F2]"
      >
        <h3 class="text-lg font-medium">{{ sidebarTitle }}</h3>
        <X class="cursor-pointer" @click="emit('on-close', false)" />
      </header>
      <div class="px-7 py-6">
        <slot />
      </div>
    </aside>
  </div>
</template>
