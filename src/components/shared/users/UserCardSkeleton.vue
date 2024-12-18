<script setup lang="ts">
import AvatarSkeleton from "./AvatarSkeleton.vue";

interface UserCardSkeletonProps {
  withDescription?: boolean;
}

withDefaults(defineProps<UserCardSkeletonProps>(), {
  withDescription: false,
});
</script>

<template>
  <div
    class="flex flex-col gap-5 justify-between min-h-[140px] rounded-lg-max p-6 bg-white drop-shadow-sm"
  >
    <div class="flex gap-5 items-center justify-between">
      <div class="flex items-center gap-2">
        <AvatarSkeleton />
        <div class="flex flex-col gap-2">
          <div
            class="w-[100px] h-3 rounded-skeleton bg-main-purple-500/30 animate-pulse"
          />
          <div
            class="w-[100px] h-3 rounded-skeleton bg-main-purple-500/15 animate-pulse"
          />
        </div>
      </div>
      <div
        class="w-20 h-3 rounded-skeleton bg-main-purple-500/30 animate-pulse"
      />
    </div>

    <div class="flex flex-col gap-3" v-if="withDescription">
      <div class="w-full h-3 rounded-skeleton bg-[#546FFF]/10" />
      <div class="w-full h-3 rounded-skeleton bg-[#546FFF]/10" />
      <div class="w-full h-3 rounded-skeleton bg-[#546FFF]/10" />
    </div>

    <div class="flex justify-between text-main-black font-medium text-sm">
      <div class="flex items-center gap-3.5">
        <div
          class="size-4 rounded-skeleton bg-main-purple-500/30 animate-pulse"
        />
        <div
          class="w-20 h-4 rounded-skeleton bg-main-purple-500/30 animate-pulse"
        />
      </div>
      <div class="flex items-center gap-3.5">
        <div
          class="size-4 rounded-skeleton bg-main-purple-500/30 animate-pulse"
        />
        <div
          class="w-20 h-4 rounded-skeleton bg-main-purple-500/30 animate-pulse"
        />
      </div>
    </div>
  </div>
</template>
