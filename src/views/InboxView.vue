<script setup lang="ts">
import {
  onBeforeMount,
  onBeforeUnmount,
  reactive,
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
const selectedChat = reactive<{ data: UserChat | null; index: number | null }>({
  data: null,
  index: null,
});
const messages = ref<IMessage[]>([]);
const messagesToUpdate = ref<(SendMessageDto | IMessage)[]>([]);

const handleChatFetch = (newChats: UserChat[]) => (chats.value = newChats);

const resetChat = () => {
  socketStore.leaveChatRoom(selectedChat.data?.chat_id as number);

  selectedChat.data = null;
  selectedChat.index = null;

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

const handleChatSelect = (chat: UserChat, index: number) => {
  if (chat.chat_id === selectedChat.data?.chat_id) return;

  if (selectedChat.data) {
    socketStore.leaveChatRoom(selectedChat.data?.chat_id);
  }

  socketStore.joinChatRoom(chat.chat_id);

  selectedChat.data = chat;
  selectedChat.index = index;
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
  messagesToUpdate: (SendMessageDto | IMessage)[],
  chatId: number
) => {
  if (!messagesToUpdate.length) return [];

  handleSeenUpdate({
    incomingMessages: messagesToUpdate,
    chatId,
  });

  socketStore.bulkMessagesSeenUpdate(
    messagesToUpdate,
    selectedChat.data?.user_id as number,
    chatId
  );
};

const handleSeenUpdate = ({
  chatId,
  incomingMessages,
}: {
  chatId: number;
  incomingMessages: (SendMessageDto | IMessage)[];
}) => {
  if (selectedChat.data?.chat_id === chatId && incomingMessages.length) {
    const messageIds = incomingMessages.map((m) => m.id);

    updateInboxStatus(messageIds);

    messages.value = messages.value.map((message) => {
      if (messageIds.includes(message.id)) {
        return { ...message, seen: true };
      }

      return message;
    });
  }
};

const handleMessageSeenEmit = (message: IMessage, index: number) => {
  messagesToUpdate.value = [...messagesToUpdate.value, message];

  if (message.chat_id === selectedChat.data?.chat_id) {
    messages.value[index] = { ...messages.value[index], seen: true };
  }
};

const updateInboxStatus = (messageIds: number[]) => {
  const chatLastMessageId =
    chats.value[selectedChat.index as number].last_message.id;

  if (messageIds.includes(chatLastMessageId)) {
    chats.value[selectedChat.index as number].last_message.seen = true;
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
      id: updateInboxMessageDto.id,
      message: updateInboxMessageDto.message,
      seen: updateInboxMessageDto.seen,
      sender_id: updateInboxMessageDto.sender_id,
    },
  };
};

onBeforeMount(() => {
  socketStore.joinInbox(sessionStore.user?.id as number);
  socketStore.socket?.on("inbox:message:seen:update", handleSeenUpdate);
  socketStore.socket?.on("inbox:receive:message", handleInboxMessageUpdate);
  socketStore.socket?.on("chat:receive:message", handleIncomingMessage);
});

watch(
  () => selectedChat.data,
  async () => {
    if (selectedChat.data?.chat_id) {
      const res = await getChatMessages(selectedChat.data.chat_id);

      if (res.status === "failure") return;

      messages.value = res.data;

      queueMicrotask(() => handleScrollToBottom("open", false));

      const unseenMessages = res.data.filter(
        (m) => !m.seen && m.sender_id !== sessionStore.user?.id
      );

      if (!unseenMessages.length) return;

      triggerUpdateSeenMessage(unseenMessages, selectedChat.data.chat_id);
    }
  }
);

watchThrottled(
  messagesToUpdate,
  () => {
    if (messagesToUpdate.value.length) {
      triggerUpdateSeenMessage(
        messagesToUpdate.value,
        messagesToUpdate.value[0].chat_id
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
      :selected-chat="selectedChat.data"
      :status-map="statusMap"
      :chats="chats"
    />
    <div v-if="selectedChat.data" class="w-full flex flex-col flex-1">
      <ChatHeader
        :selected-chat="selectedChat.data"
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
        :selected-chat="selectedChat.data"
      />
    </div>
  </section>
</template>
