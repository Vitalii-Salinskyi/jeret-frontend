<script setup lang="ts">
import {
  onBeforeMount,
  onBeforeUnmount,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { watchThrottled } from "@vueuse/core";

import { useSessionStore } from "@/stores/sessionStore";
import { useSocketStore } from "@/stores/socketStore";

import ChatMessage from "@/components/shared/inbox/ChatMessage.vue";
import ChatHeader from "@/components/shared/inbox/ChatHeader.vue";
import ChatInput from "@/components/shared/inbox/ChatInput.vue";
import ChatList from "@/components/shared/inbox/ChatList.vue";

import { getChatMessages } from "@/api/chats";

import {
  IMessage,
  SendMessageDto,
  UpdateInboxMessageDto,
  UserChat,
} from "@/interfaces/chats";
import { UserStatusType } from "@/interfaces/users";

const sessionStore = useSessionStore();
const socketStore = useSocketStore();

const messageArea = useTemplateRef("messages-area");

const chats = ref<UserChat[]>([]);
const statusMap = ref<UserStatusType>({});
const selectedChat = ref<UserChat>();
const messages = ref<IMessage[]>([]);
const messagesToUpdate = ref<SendMessageDto[]>([]);

const handleChatFetch = (newChats: UserChat[]) => (chats.value = newChats);

const resetChat = () => {
  socketStore.leaveChatRoom(selectedChat.value?.chat_id as number);

  selectedChat.value = undefined;
  messages.value = [];
  messagesToUpdate.value = [];
};

const handleStatusesFetch = (statuses: UserStatusType) =>
  (statusMap.value = statuses);

const handleScrollToBottom = (
  type: "open" | "update" = "open",
  isSmooth: boolean = false,
  senderId?: number
) => {
  if (messageArea.value) {
    const distanceFromBottom =
      messageArea.value.scrollHeight -
      (messageArea.value.scrollTop + messageArea.value.clientHeight);

    if (
      type === "open" ||
      senderId === sessionStore.user?.id ||
      distanceFromBottom <= 200
    ) {
      messageArea.value.scrollTo({
        top: messageArea.value.scrollHeight,
        behavior: isSmooth ? "smooth" : "instant",
      });
    }
  }
};

const handleChatSelect = (chat: UserChat) => {
  if (chat.chat_id === selectedChat.value?.chat_id) return;

  if (selectedChat.value) {
    socketStore.leaveChatRoom(selectedChat.value?.chat_id);
  }

  socketStore.joinChatRoom(chat.chat_id);

  selectedChat.value = chat;
  messagesToUpdate.value = [];
};

const handleIncomingMessage = (newMessage: IMessage) => {
  setTimeout(
    () => handleScrollToBottom("update", true, newMessage.sender_id),
    25
  );

  messages.value.push(newMessage);
};

const triggerUpdateSeenMessage = (
  messagesToUpdate: SendMessageDto[],
  chatId: number,
  type: "save" | "update"
) => {
  if (!messagesToUpdate.length) return [];

  handleSeenUpdate(
    {
      incomingMessages: messagesToUpdate,
      chatId,
    },
    type
  );

  socketStore.bulkMessagesSeenUpdate(
    messagesToUpdate,
    selectedChat.value?.user_id as number,
    chatId,
    type
  );
};

const handleSeenUpdate = (
  {
    chatId,
    incomingMessages,
  }: {
    chatId: number;
    incomingMessages: SendMessageDto[];
  },
  type: "save" | "update"
) => {
  if (selectedChat.value?.chat_id === chatId && incomingMessages.length) {
    messages.value = messages.value.map((message) => {
      if (type === "update") {
        const messageIds = incomingMessages.map((m) => m.id);

        if (messageIds.includes(message.id)) {
          return { ...message, seen: true };
        }
      } else {
        const messageToUpdate = incomingMessages.findIndex(
          (m) =>
            m.created_at === message.created_at &&
            message.sender_id === m.sender_id &&
            message.message === m.message
        );
        if (messageToUpdate !== -1) {
          return { ...message, seen: true };
        }
      }
      return message;
    });
  }
};

const handleMessageSeenEmit = (message: IMessage, index: number) => {
  messagesToUpdate.value = [...messagesToUpdate.value, message];

  if (message.chat_id === selectedChat.value?.chat_id) {
    messages.value[index] = { ...messages.value[index], seen: true };
  }
};

const handleInboxMessageUpdate = (
  updateInboxMessageDto: UpdateInboxMessageDto
) => {
  const chatIndex = chats.value.findIndex(
    (chat) => chat.chat_id === updateInboxMessageDto.chat_id
  );

  if (chatIndex === -1) return;

  chats.value[chatIndex] = {
    ...chats.value[chatIndex],
    last_message: {
      ...chats.value[chatIndex].last_message,
      message: updateInboxMessageDto.message,
      seen: updateInboxMessageDto.seen,
      sender_id: updateInboxMessageDto.sender_id,
    },
  };
};

onBeforeMount(() => {
  socketStore.joinInbox(sessionStore.user?.id as number);
  socketStore.socket?.on("inbox:message:seen:update", (data) => {
    handleSeenUpdate(data, "update");
  });
  socketStore.socket?.on("inbox:receive:message", handleInboxMessageUpdate);
  socketStore.socket?.on("chat:receive:message", handleIncomingMessage);
});

watch(
  () => selectedChat.value,
  async () => {
    if (selectedChat.value?.chat_id) {
      const res = await getChatMessages(selectedChat.value.chat_id);

      if (res.status === "failure") return;

      messages.value = res.data;

      setTimeout(() => handleScrollToBottom("open", false), 0);

      const unseenMessages = res.data.filter(
        (m) => !m.seen && m.sender_id !== sessionStore.user?.id
      );

      if (!unseenMessages.length) return;

      triggerUpdateSeenMessage(
        unseenMessages,
        selectedChat.value.chat_id,
        "update"
      );
    }
  }
);

watchThrottled(
  messagesToUpdate,
  () => {
    if (messagesToUpdate.value.length) {
      triggerUpdateSeenMessage(
        messagesToUpdate.value,
        messagesToUpdate.value[0].chat_id,
        "save"
      );
      messagesToUpdate.value = [];
    }
  },
  { throttle: 500 }
);

onBeforeUnmount(() => {
  socketStore.socket?.off("inbox:message:seen:update");
  socketStore.socket?.off("inbox:receive:message");
  socketStore.socket?.off("chat:receive:message");
  socketStore.leaveInbox(sessionStore.user?.id as number);
});
</script>

<template>
  <section class="flex border-t border-[#F5F5F7] h-[calc(100vh-116px)]">
    <ChatList
      @select-chat="handleChatSelect"
      @fetch-chats="handleChatFetch"
      @fetch-statuses="handleStatusesFetch"
      :selected-chat="selectedChat"
      :status-map="statusMap"
      :chats="chats"
    />
    <div v-if="selectedChat" class="w-full flex flex-col flex-1">
      <ChatHeader
        :selected-chat="selectedChat"
        :status-map="statusMap"
        @reset-chats="resetChat"
      />
      <div
        ref="messages-area"
        class="flex flex-col gap-0.5 flex-1 p-8 overflow-y-scroll invisible-scrollbar"
      >
        <div class="mt-auto" />
        <ChatMessage
          v-for="(message, index) in messages"
          @message-in-view="handleMessageSeenEmit"
          :key="message.id"
          :is-own-message="message.sender_id === sessionStore.user?.id"
          :message
          :index
        />
      </div>
      <ChatInput
        @update-inbox-message="handleInboxMessageUpdate"
        :senderId="sessionStore.user?.id as number"
        :selected-chat="selectedChat"
      />
    </div>
  </section>
</template>
