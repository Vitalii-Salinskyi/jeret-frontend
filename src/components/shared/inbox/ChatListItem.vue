<script setup lang="ts">
import Avatar from "@/components/ui/Avatar.vue";

import { Check, CheckCheck } from "lucide-vue-next";

import { UserStatusType } from "@/interfaces/users";
import { UserChat } from "@/interfaces/chats";

interface ChatListItemProps {
  statusMap: UserStatusType;
  isSelected: boolean;
  chatsLength: number;
  chat: UserChat;
  index: number;
}

defineProps<ChatListItemProps>();

const emit = defineEmits<{
  (event: "select-chat", chat: UserChat): void;
}>();
</script>

<template>
  <div @click="() => emit('select-chat', chat)">
    <div
      :class="{
        'flex items-center gap-3 py-2.5 px-5 cursor-pointer transition-colors hover:bg-[#FAFAFA] rounded-lg-max': true,
        'bg-[#FAFAFA]': isSelected,
      }"
    >
      <div class="relative">
        <div
          v-if="statusMap"
          :class="[
            'size-2 rounded-full absolute top-0.5 right-0.5 z-10 block min-[1364px]:hidden transition-colors',
            statusMap[chat.user_id] === 'online'
              ? 'bg-green-500'
              : 'bg-red-500',
          ]"
        />
        <Avatar
          :name="chat.name"
          :src="chat.profile_picture"
          :alt="`${chat.name}'s profile picture'`"
          class-name="size-12"
        />
      </div>
      <div
        class="flex md:hidden min-[1364px]:flex flex-col gap-1 text-main-black flex-1"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">
            {{ chat.name }}
          </h3>
          <div
            v-if="statusMap"
            :class="[
              'size-2 rounded-full z-10 hidden min-[1364px]:block transition-colors',
              statusMap[chat.user_id] === 'online'
                ? 'bg-green-500'
                : 'bg-red-500',
            ]"
          />
        </div>
        <div class="flex items-center justify-between gap-5">
          <p class="max-w-[196px] truncate text-xs">
            {{
              chat.last_message?.files_attached
                ? "picture(s)"
                : chat.last_message
                ? chat.last_message.message
                : `Say hi to ${chat.name}`
            }}
          </p>
          <div class="size-[18px] flex-center">
            <CheckCheck
              v-if="chat.last_message && chat.last_message.seen"
              class="text-[#04A4F4]"
              width="17"
              height="17"
            />
            <Check
              v-if="chat.last_message && !chat.last_message.seen"
              class="text-[#04A4F4]"
              width="16"
              height="16"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="index !== chatsLength - 1"
      class="my-2 min-[1364px]:my-4 mx-auto w-[calc(100%-40px)] h-px bg-[#F5F5F7]"
    />
  </div>
</template>
