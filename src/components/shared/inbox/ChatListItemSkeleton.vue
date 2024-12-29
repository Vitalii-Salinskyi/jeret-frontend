<script setup lang="ts">
import AvatarSkeleton from "../users/AvatarSkeleton.vue";

interface ChatListItemSkeletonProps {
  index: number;
  length: number;
}

defineProps<ChatListItemSkeletonProps>();
</script>

<template>
  <div>
    <div
      class="flex items-center gap-3 py-2.5 px-5 cursor-pointer transition-colors hover:bg-[#FAFAFA] rounded-lg-max"
    >
      <AvatarSkeleton />
      <div class="hidden min-[1364px]:flex flex-col items-center gap-2">
        <div
          class="h-3 w-[6.25rem] rounded-skeleton bg-main-purple-500/30 animate-pulse"
        />
        <div
          class="h-3 w-[6.25rem] rounded-skeleton bg-main-purple-500/15 animate-pulse"
        />
      </div>
    </div>

    <div
      v-if="index !== length - 1"
      class="my-2 min-[1364px]:my-4 mx-auto w-[calc(100%-40px)] h-px bg-[#F5F5F7]"
    />
  </div>
</template>
