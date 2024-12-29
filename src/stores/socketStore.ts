import { defineStore } from "pinia";
import { ref } from "vue";

import { io, Socket } from "socket.io-client";
import { UserStatusType } from "@/interfaces/users";

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
      startHeartbeat(userId);
    });

    socketClient.on("disconnect", () => {
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

  return {
    socket,
    connect,
    getBulkUserStatus,
    getSingleUserStatus,
  };
});
