<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from "vue";

import { FileText, X } from "lucide-vue-next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FilePreviewProps {
  file: File;
  index: number;
}

const props = defineProps<FilePreviewProps>();

const emit = defineEmits<{
  (event: "remove-file", file: File): void;
}>();

const fileUrl = ref<string | undefined>(undefined);

const getFilePreview = (file: File) => {
  if (file.type.startsWith("image/")) {
    fileUrl.value = URL.createObjectURL(file);
  }
};

onBeforeMount(() => getFilePreview(props.file));

onBeforeUnmount(() => {
  if (fileUrl.value) URL.revokeObjectURL(fileUrl.value);
});
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipContent class="text-center">{{ file.name }}</TooltipContent>
      <TooltipTrigger
        class="relative flex-center bg-gray-100/70 rounded-lg-max size-14"
      >
        <div
          @click="emit('remove-file', file)"
          class="absolute bg-white drop-shadow-sm shadow-sm size-4 rounded-full -top-1 -right-1 border border-gray-300/90 cursor-pointer p-px"
        >
          <X class="size-full text-black" />
        </div>
        <img
          class="size-full object-cover rounded-lg-max overflow-hidden"
          v-if="fileUrl"
          :src="fileUrl"
          :alt="file.name"
        />
        <FileText v-else class="size-12 text-[#9C9CA4]" />
      </TooltipTrigger>
    </Tooltip>
  </TooltipProvider>
</template>
