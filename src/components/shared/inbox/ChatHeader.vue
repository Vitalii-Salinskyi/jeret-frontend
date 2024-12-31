<script setup lang="ts">
import Avatar from "@/components/ui/Avatar.vue";

import { ArrowLeft } from "lucide-vue-next";

import { UserStatusType } from "@/interfaces/users";
import { UserChat } from "@/interfaces/chats";

interface ChatHeaderProps {
  selectedChat: UserChat;
  statusMap: UserStatusType;
}

defineProps<ChatHeaderProps>();

const emit = defineEmits<{
  (event: "reset-chats"): void;
}>();
</script>

<template>
  <div class="flex bg-white px-6 md:px-12 py-6">
    <div class="flex items-center gap-3">
      <ArrowLeft
        @click="() => emit('reset-chats')"
        class="cursor-pointer md:hidden"
        width="20"
      />
      <Avatar
        :name="selectedChat.name"
        :src="selectedChat.profile_picture"
        :alt="`${selectedChat.name}'s profile picture'`"
        class-name="size-12 md:size-[52px]"
      />
      <div class="flex flex-col gap-2 text-main-black">
        <h2 class="font-semibold text-sm">{{ selectedChat.name }}</h2>
        <div class="flex items-center gap-0.5">
          <div class="flex-center size-4">
            <div
              :class="[
                'size-2 rounded-full transition-colors',
                statusMap[selectedChat.user_id] === 'online'
                  ? 'bg-green-500'
                  : 'bg-red-500',
              ]"
            />
          </div>
          <strong class="font-medium text-xs">
            {{
              statusMap[selectedChat.user_id] === "online"
                ? "Online"
                : "Offline"
            }}
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>
