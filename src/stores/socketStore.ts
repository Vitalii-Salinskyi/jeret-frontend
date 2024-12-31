import { ref } from "vue";
import { defineStore } from "pinia";

import { io, Socket } from "socket.io-client";

import { UserStatusType } from "@/interfaces/users";
import { SendMessageDto, UpdateInboxMessageDto } from "@/interfaces/chats";

export const useSocketStore = defineStore("socket", () => {
  const socket = ref<Socket | null>(null);
  const heartbeatInterval = ref<NodeJS.Timeout | null>(null);

  const startHeartbeat = (userId: number) => {
    if (heartbeatInterval.value) {
      clearInterval(heartbeatInterval.value);
    }

    heartbeatInterval.value = setInterval(async () => {
      if (socket.value) {
        socket.value.emit("status:heartbeat", userId);
      }
    }, 12500);
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.value) {
      clearInterval(heartbeatInterval.value);
      heartbeatInterval.value = null;
    }
  };

  const connect = (userId: number) => {
    const socketClient = io(`${import.meta.env.VITE_SERVER_URL}`, {
      auth: {
        userId,
      },
    });

    socket.value = socketClient;

    socketClient.on("connect", () => {
      console.debug("Socket connected");
      startHeartbeat(userId);
    });

    socketClient.on("disconnect", () => {
      console.debug("Socket disconnected");
      stopHeartbeat();
    });
  };

  const getSingleUserStatus = async (
    userId: number
  ): Promise<UserStatusType> => {
    return new Promise((resolve) => {
      socket.value?.emit("status:single", userId, (res: UserStatusType) =>
        resolve(res)
      );
    });
  };

  const getBulkUserStatus = async (
    userIds: number[]
  ): Promise<UserStatusType> => {
    return new Promise((resolve) => {
      socket.value?.emit("status:bulk", userIds, (res: UserStatusType) =>
        resolve(res)
      );
    });
  };

  const joinInbox = (userId: number) => {
    socket.value?.emit("inbox:join", userId);
  };

  const leaveInbox = (userId: number) => {
    socket.value?.emit("inbox:leave", userId);
  };

  const joinChatRoom = (chatId: number) => {
    socket.value?.emit("chat:join", chatId);
  };

  const leaveChatRoom = (chatId: number) => {
    socket.value?.emit("chat:leave", chatId);
  };

  const sendMessage = (sendMessageDto: SendMessageDto) => {
    socket.value?.emit("chat:send:message", sendMessageDto);
  };

  const sendInboxMessage = (message: UpdateInboxMessageDto) => {
    socket.value?.emit("inbox:send:message", message);
  };

  const bulkMessagesSeenUpdate = (
    messages: SendMessageDto[],
    receiverId: number,
    chatId: number,
    type: "save" | "update"
  ) => {
    socket.value?.emit("chat:update:messages:seen", {
      messages,
      receiverId,
      chatId,
      type,
    });
  };

  return {
    socket,
    connect,
    sendMessage,
    joinChatRoom,
    joinInbox,
    leaveChatRoom,
    leaveInbox,
    sendInboxMessage,
    getBulkUserStatus,
    bulkMessagesSeenUpdate,
    getSingleUserStatus,
  };
});
