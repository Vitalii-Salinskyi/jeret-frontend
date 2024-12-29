<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";

import { useSocketStore } from "@/stores/socketStore";

import ChatListItemSkeleton from "./ChatListItemSkeleton.vue";
import ChatListItem from "./ChatListItem.vue";
import SearchInput from "@/components/ui/SearchInput.vue";

import { getUsersChats } from "@/api/chats";

import { UserStatusType } from "@/interfaces/users";
import { UserChat } from "@/interfaces/chats";

interface ChatListProps {
  chats: UserChat[];
  statusMap: UserStatusType;
  selectedChat: UserChat | undefined;
}

const props = defineProps<ChatListProps>();

const emit = defineEmits<{
  (event: "select-chat", chat: UserChat): void;
  (event: "fetch-chats", chats: UserChat[]): void;
  (event: "fetch-statuses", statuses: UserStatusType): void;
}>();

let statusInterval: NodeJS.Timeout | undefined;

const socketStore = useSocketStore();

const search = ref<string>("");
const isLoading = ref<boolean>(true);

const filteredChats = computed(() => {
  if (search.value) {
    return props.chats.filter((chat) =>
      chat.name.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  return [];
});

onBeforeMount(async () => {
  try {
    const res = await getUsersChats();

    if (res.status === "failure") return;

    emit("fetch-chats", res.data);
  } finally {
    isLoading.value = false;
  }
});

const getStatuses = async (userIds: number[]) => {
  try {
    const res = await socketStore.getBulkUserStatus(userIds);

    emit("fetch-statuses", res);
  } catch (error) {
    throw error;
  }
};

watch(
  () => props.chats,
  async () => {
    clearInterval(statusInterval);

    if (props.chats.length) {
      const userIds = props.chats.map((chat) => chat.user_id);

      await getStatuses(userIds);

      statusInterval = setInterval(async () => {
        await getStatuses(userIds);
      }, 3500);
    }
  }
);

onBeforeUnmount(() => clearInterval(statusInterval));
</script>

<template>
  <aside
    class="bg-white p-1 min-[1364px]:p-6 pb-0 flex flex-col gap-8 min-[1364px]:w-[400px] border-r border-[#F5F5F7]"
  >
    <div class="hidden min-[1364px]:block">
      <SearchInput
        @search-input="(e) => (search = e)"
        placeholder="Search Name"
        class-name="w-full"
        :search
      />
    </div>
    <div class="flex flex-col overflow-y-auto invisible-scrollbar">
      <template v-if="isLoading">
        <ChatListItemSkeleton
          v-for="(_, index) in Array(10).fill(0)"
          :index="index"
          :length="10"
        />
      </template>
      <template v-else-if="search.trim().length">
        <ChatListItem
          @click="() => emit('select-chat', chat)"
          v-for="(chat, index) in filteredChats"
          v-if="filteredChats.length"
          :key="chat.chat_id"
          :is-selected="selectedChat?.chat_id === chat.chat_id"
          :chats-length="chats.length"
          :status-map="statusMap"
          v-bind:chat
          :index
        />

        <p
          class="my-auto h-full mx-auto text-main-purple-500 font-medium text-center px-3 hidden min-[1364px]:block"
          v-else
        >
          No chats found matching!
        </p>
      </template>
      <template v-else>
        <ChatListItem
          @click="() => emit('select-chat', chat)"
          v-for="(chat, index) in chats"
          v-if="chats.length"
          :key="chat.chat_id"
          :is-selected="selectedChat?.chat_id === chat.chat_id"
          :chats-length="chats.length"
          :status-map="statusMap"
          v-bind:chat
          :index
        />

        <p
          class="my-auto h-full mx-auto text-main-purple-500 font-medium text-center hidden min-[1364px]:block"
          v-else
        >
          You have no chats yet!
        </p>
      </template>
    </div>
  </aside>
</template>
