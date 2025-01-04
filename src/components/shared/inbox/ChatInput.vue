<script setup lang="ts">
import { ref, useTemplateRef } from "vue";

import { useSocketStore } from "@/stores/socketStore";

import FilePreview from "./FilePreview.vue";

import { Paperclip, Send } from "lucide-vue-next";

import { formatDateWithTimezone } from "@/utils";

import {
  IFileDto,
  SendMessageDto,
  UpdateInboxMessageDto,
  UserChat,
} from "@/interfaces/chats";

interface ChatInputProps {
  senderId: number;
  selectedChat: UserChat | undefined;
}

const props = defineProps<ChatInputProps>();

const emit = defineEmits<{
  (event: "update-inbox-message", message: UpdateInboxMessageDto): void;
}>();

const socketStore = useSocketStore();

const messageRef = useTemplateRef<HTMLTextAreaElement>("message-ref");
const fileInputRef = useTemplateRef<HTMLInputElement>("file-input-ref");

const message = ref<string>("");
const selectedFiles = ref<File[]>([]);

const handleInput = (e: Event) => {
  const messageEl = messageRef.value;
  const event = e.target as HTMLTextAreaElement;

  if (messageEl) {
    if (messageEl.scrollHeight > 20) {
      adjustInputHeight(messageEl);
    }

    if (event.value.trim().length > 0) {
      messageEl.style.height = `${messageEl.scrollHeight / 16}rem`;
    } else {
      messageEl.style.height = "1.25rem";
    }
  }
};

const adjustInputHeight = (messageEl?: HTMLTextAreaElement) => {
  const container = messageEl ?? messageRef.value;

  if (container) {
    container.style.height = "auto";
    container.style.height = "1.25rem";
  }
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;

  if (input.files) {
    selectedFiles.value.push(...Array.from(input.files));
  }

  input.value = "";
};

const removeFile = (fileToRemove: File) => {
  console.log(fileToRemove);

  selectedFiles.value = selectedFiles.value.filter(
    (file) => file !== fileToRemove
  );
};

const resetFiles = () => {
  selectedFiles.value = [];
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const handleSendMessage = async () => {
  const trimmedMessage = message.value.trim();

  if (
    !props.selectedChat ||
    !props.senderId ||
    (!trimmedMessage.length && !selectedFiles.value.length)
  ) {
    return;
  }

  const messageId = await socketStore.getNextId("messages");
  const created_at = formatDateWithTimezone(new Date());

  const files = await processFiles(messageId, created_at);

  const newMessage: SendMessageDto = {
    id: messageId,
    created_at,
    chat_id: props.selectedChat.chat_id,
    sender_id: props.senderId,
    message: trimmedMessage,
    seen: false,
    files,
  };

  socketStore.sendMessage(newMessage);

  const { files: _messageFiles, ...messageWithoutFiles } = newMessage;

  const inboxMessage: UpdateInboxMessageDto = {
    ...messageWithoutFiles,
    files_attached: !!files.length,
    receiver_id: props.selectedChat.user_id,
    seen: false,
  };

  emit("update-inbox-message", inboxMessage);
  socketStore.sendInboxMessage(inboxMessage);

  message.value = "";

  adjustInputHeight();
  resetFiles();
};

const processFiles = async (
  messageId: number,
  uploaded_at: string
): Promise<IFileDto[]> => {
  const files: IFileDto[] = [];

  if (!selectedFiles.value.length) return [];

  const fileReadPromises = selectedFiles.value.map(async (file) => {
    const fileId = await socketStore.getNextId("files");

    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;

      reader.readAsArrayBuffer(file);
    });

    return {
      id: fileId,
      s3_path: `${fileId}.${file.name.split(".").pop()}`,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      sender_id: props.senderId,
      message_id: messageId,
      buffer: arrayBuffer,
      uploaded_at,
    };
  });

  const fileInfos = await Promise.all(fileReadPromises);
  files.push(...fileInfos);

  return files;
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
  <div class="flex flex-col gap-1 px-8 py-[18px] bg-white">
    <div
      v-if="selectedFiles?.length"
      class="flex flex-wrap gap-2.5 overflow-x-auto py-1 max-h-16"
    >
      <FilePreview
        v-for="(file, index) in Array.from(selectedFiles || [])"
        :key="file.name + file.type"
        @remove-file="removeFile"
        :index
        :file
      />
    </div>
    <div
      class="flex items-center justify-between gap-5 w-full overflow-x-hidden"
    >
      <div
        class="w-[85%] max-h-64 overflow-y-auto invisible-scrollbar pr-0.5 flex relative"
      >
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
      <div class="flex justify-between items-center gap-4">
        <button
          class="relative cursor-pointer active:scale-95 overflow-hidden p-1 rounded-lg-max transition-all hover:bg-gray-200/35"
        >
          <input
            @change="handleFileChange"
            class="absolute top-0 bottom-0 -left-28 opacity-0 cursor-pointer h-10 w-48"
            ref="file-input-ref"
            tabindex="-1"
            max="5"
            type="file"
            multiple
          />
          <Paperclip
            class="text-[#9C9CA4] cursor-pointer"
            width="24"
            height="24"
          />
        </button>
        <div
          @click="handleSendMessage"
          class="flex-center size-11 p-2.5 bg-main-purple-500 rounded-lg-max cursor-pointer transition-transform active:scale-95"
        >
          <Send width="24" height="24" class="text-white" />
        </div>
      </div>
    </div>
  </div>
</template>
