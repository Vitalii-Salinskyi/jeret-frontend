<script setup lang="ts">
import { Check, CheckCheck } from "lucide-vue-next";

interface MessageInfo {
  created_at: string;
  isOwnMessage: boolean;
  formattedDate: string;
  seen: boolean;
}

defineProps<MessageInfo>();
</script>

<template>
  <span class="flex items-center gap-px">
    <time
      :datetime="created_at"
      :class="[
        'text-xs self-end',
        isOwnMessage ? 'text-main-purple-200/90' : 'text-[#8E92BC]',
      ]"
    >
      {{ formattedDate }}
    </time>
    <div v-if="isOwnMessage" class="self-end mb-0.5">
      <CheckCheck v-if="seen" class="text-[#04A4F4]" width="14" height="14" />
      <Check v-else class="text-[#04A4F4]" width="14" height="14" />
    </div>
  </span>
</template>
