<script setup lang="ts">
import { useTemplateRef, watch } from "vue";
import { useElementVisibility } from "@vueuse/core";

import { Check, CheckCheck } from "lucide-vue-next";

import { formatDate } from "@/utils";

import { IMessage } from "@/interfaces/chats";
import { useSessionStore } from "@/stores/sessionStore";

interface ChatMessageProps {
  message: IMessage;
  isOwnMessage: boolean;
  index: number;
}

const sessionStore = useSessionStore();

const props = defineProps<ChatMessageProps>();

const emit = defineEmits<{
  (event: "message-in-view", message: IMessage, index: number): void;
}>();

const formattedDate = formatDate(props.message.created_at);

const target = useTemplateRef("target");
const isVisible = useElementVisibility(target);

watch(
  () => isVisible.value,
  () => {
    if (
      isVisible.value &&
      !props.message.seen &&
      props.message.sender_id !== sessionStore.user?.id
    ) {
      console.log(
        "from message",
        props.message.sender_id,
        sessionStore.user?.id
      );
      emit("message-in-view", props.message, props.index);
    }
  }
);
</script>

<template>
  <div
    ref="target"
    :class="[
      'flex gap-1.5 py-2 font-medium text-sm shadow-sm drop-shadow-sm rounded-lg-max max-w-[390px] w-fit relative pl-3 pr-1.5',
      isOwnMessage
        ? 'ml-auto rounded-tr-none bg-main-purple-500'
        : 'rounded-tl-none bg-white',
    ]"
  >
    <span
      :class="[
        'text-main-black break-words whitespace-pre-wrap',
        isOwnMessage ? 'text-white' : 'text-main-black',
      ]"
    >
      {{ message.message }}
    </span>
    <span class="flex items-center gap-px">
      <time
        :datetime="message.created_at"
        :class="[
          'text-xs self-end',
          isOwnMessage ? 'text-main-purple-200/90' : 'text-[#8E92BC]',
        ]"
      >
        {{ formattedDate }}
      </time>
      <div v-if="isOwnMessage" class="self-end mb-0.5">
        <CheckCheck
          v-if="message.seen"
          class="text-[#04A4F4]"
          width="14"
          height="14"
        />
        <Check v-else class="text-[#04A4F4]" width="14" height="14" />
      </div>
    </span>
  </div>
</template>
