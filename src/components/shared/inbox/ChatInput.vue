<script setup lang="ts">
import { ref, useTemplateRef } from "vue";

import { useSocketStore } from "@/stores/socketStore";

import { Paperclip, Send } from "lucide-vue-next";
import {
  SendMessageDto,
  UpdateInboxMessageDto,
  UserChat,
} from "@/interfaces/chats";
import { formatDateWithTimezone } from "@/utils";

interface ChatInputProps {
  senderId: number;
  selectedChat: UserChat | undefined;
}

const props = defineProps<ChatInputProps>();

const emit = defineEmits<{
  (event: "trigger-scroll"): void;
  (event: "update-inbox-message", message: UpdateInboxMessageDto): void;
}>();

const socketStore = useSocketStore();

const messageRef = useTemplateRef<HTMLTextAreaElement>("message-ref");

const message = ref<string>("");

const handleInput = (e: Event) => {
  const messageEl = messageRef.value;
  const event = e.target as HTMLTextAreaElement;

  if (messageEl) {
    if (messageEl.scrollHeight > 20) {
      messageEl.style.height = "auto";
      messageEl.style.height = "1.25rem";
    }

    if (event.value.trim().length > 0) {
      messageEl.style.height = `${messageEl.scrollHeight / 16}rem`;
    } else {
      messageEl.style.height = "1.25rem";
    }
  }
};

const handleSendMessage = async () => {
  const trimmedMessage = message.value.trim();

  if (!props.selectedChat || !props.senderId || !trimmedMessage.length) return;

  const messageId = await socketStore.getNextMessageId();

  const newMessage: SendMessageDto = {
    id: messageId,
    created_at: formatDateWithTimezone(new Date()),
    chat_id: props.selectedChat.chat_id,
    sender_id: props.senderId,
    message: trimmedMessage,
    seen: false,
  };

  socketStore.sendMessage(newMessage);

  const inboxMessage: UpdateInboxMessageDto = {
    ...newMessage,
    receiver_id: props.selectedChat.user_id,
    seen: false,
  };

  emit("update-inbox-message", inboxMessage);
  socketStore.sendInboxMessage(inboxMessage);

  if (messageRef.value) {
    messageRef.value.style.height = "auto";
    messageRef.value.style.height = "1.25rem";
  }

  message.value = "";
  emit("trigger-scroll");
};

const handleMessageSend = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
    e.preventDefault();
    message.value = (e.target as HTMLTextAreaElement).value;
    handleSendMessage();
  }
};
</script>

<template>
  <div
    class="flex items-center justify-between bg-white px-8 py-[18px] gap-5 max-w-full overflow-x-hidden"
  >
    <div class="w-[85%] max-h-64 overflow-y-auto pr-0.5 flex relative">
      <textarea
        class="w-full resize-none overflow-hidden text-sm text-main-black outline-none z-10"
        :style="{ height: `1.25rem` }"
        @input="handleInput"
        @keydown="handleMessageSend"
        ref="message-ref"
        v-model="message"
      />
      <p
        v-if="!message.length"
        class="absolute top-1/2 -translate-y-1/2 text-[#8E92BC] text-sm z-10 pointer-events-none select-none"
      >
        Send a message...
      </p>
    </div>
    <div class="flex justify-between items-center gap-5">
      <Paperclip
        class="text-[#9C9CA4] cursor-pointer transition-transform active:scale-95"
        width="24"
        height="24"
      />
      <div
        @click="handleSendMessage"
        class="flex-center size-11 p-2.5 bg-main-purple-500 rounded-lg-max cursor-pointer transition-transform active:scale-95"
      >
        <Send width="24" height="24" class="text-white" />
      </div>
    </div>
  </div>
</template>
