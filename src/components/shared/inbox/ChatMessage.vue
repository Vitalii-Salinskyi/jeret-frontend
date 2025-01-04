<script setup lang="ts">
import { onBeforeMount, ref, useTemplateRef, watch } from "vue";
import { useElementVisibility } from "@vueuse/core";

import { useSessionStore } from "@/stores/sessionStore";

import MessageInfo from "./MessageInfo.vue";

import { FileText } from "lucide-vue-next";

import { getFileUrl } from "@/api/storage";

import { formatBytes, formatDate } from "@/utils";

import { IMessage, IURL } from "@/interfaces/chats";

interface ChatMessageProps {
  message: IMessage;
  isOwnMessage: boolean;
  index: number;
}

const MAX_RETRIES = 6;

const sessionStore = useSessionStore();

const props = defineProps<ChatMessageProps>();

const emit = defineEmits<{
  (event: "message-in-view", message: IMessage, index: number): void;
}>();

const fileUrls = ref<IURL[]>([]);
const formattedDate = formatDate(props.message.created_at);

const target = useTemplateRef("target");
const isVisible = useElementVisibility(target);

onBeforeMount(async () => {
  if (!props.message.files?.length) return;

  const promises = props.message.files.map((file) => {
    return getFileUrl(file.s3_path).then((res) => {
      return {
        url: res.data,
        name: file.file_name,
        size: file.file_size,
        type: file.file_type,
        uploaded_at: file.uploaded_at,
        retry_count: 0,
      };
    });
  });

  const urls: IURL[] = await Promise.all(promises);

  fileUrls.value = urls;
});

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

const handleImageError = (e: Event, urlObj: IURL) => {
  if (urlObj.retry_count < MAX_RETRIES) {
    urlObj.retry_count++;

    const img = e.target as HTMLImageElement;
    img.src = "";

    setTimeout(() => {
      img.src = urlObj.url;
    }, 325 * urlObj.retry_count);
  } else {
    console.error(
      `Max retries reached. Image ${urlObj.name} with URL: ${urlObj.url} failed to load.`
    );
  }
};
</script>

<template>
  <div
    :class="[
      'flex flex-col gap-2 p-2 pr-3.5 shadow-sm drop-shadow-sm rounded-lg-max max-w-[425px] w-fit',
      isOwnMessage
        ? 'ml-auto rounded-tr-none bg-main-purple-500'
        : 'rounded-tl-none bg-white',
    ]"
    v-if="message.files?.length"
  >
    <template async v-for="urlObj of fileUrls">
      <a
        :href="urlObj.url"
        :download="urlObj.name"
        class="flex gap-3.5 cursor-pointer"
      >
        <div
          class="flex-[0.5] min-w-16 max-w-16 h-16 bg-white flex-center rounded-md overflow-hidden"
        >
          <img
            v-if="urlObj.type.startsWith('image/')"
            :src="urlObj.url"
            class="object-cover size-full inbox-img"
            @error="(e) => handleImageError(e, urlObj)"
          />
          <div v-else class="relative flex-center rounded-lg-max w-16">
            <FileText class="text-main-purple-500 size-10" />
          </div>
        </div>
        <div class="flex-1 flex flex-col justify-between py-0.5">
          <h4
            :class="[
              'whitespace-nowrap text-sm',
              isOwnMessage ? 'text-white' : 'text-black',
            ]"
          >
            {{
              urlObj.name.length > 30
                ? urlObj.name.slice(0, 15) + "..." + urlObj.name.slice(-15)
                : urlObj.name
            }}
          </h4>
          <div
            :class="[
              'flex items-center gap-2 text-xs justify-between',
              isOwnMessage ? 'text-white' : 'text-black',
            ]"
          >
            <h5 class="whitespace-nowrap">
              {{ formatBytes(urlObj.size) }}
            </h5>
            <MessageInfo
              :created_at="urlObj.uploaded_at"
              :formatted-date="formattedDate"
              :is-own-message="isOwnMessage"
              :seen="message.seen"
            />
          </div>
        </div>
      </a>
    </template>
  </div>

  <div
    v-if="message.message"
    :class="[
      'flex flex-col gap-2 py-2 pl-3 pr-1.5 shadow-sm drop-shadow-sm rounded-lg-max max-w-[390px] w-fit',
      isOwnMessage
        ? 'ml-auto rounded-tr-none bg-main-purple-500'
        : 'rounded-tl-none bg-white',
    ]"
  >
    <div
      ref="target"
      :class="['flex justify-between gap-1.5 font-medium text-sm']"
    >
      <span
        :class="[
          'text-main-black break-words whitespace-pre-wrap',
          isOwnMessage ? 'text-white' : 'text-main-black',
        ]"
      >
        {{ message.message }}
      </span>
      <MessageInfo
        :created_at="message.created_at"
        :formatted-date="formattedDate"
        :is-own-message="isOwnMessage"
        :seen="message.seen"
      />
    </div>
  </div>
</template>
