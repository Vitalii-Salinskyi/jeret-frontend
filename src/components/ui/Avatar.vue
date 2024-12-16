<script setup lang="ts">
import {
  HTMLAttributes,
  onBeforeMount,
  onMounted,
  ref,
  useTemplateRef,
} from "vue";

import { cn } from "@/lib/utils";

interface AvatarProps {
  class?: HTMLAttributes["class"];
  name: string;
  src: string;
  alt: string;
}

withDefaults(defineProps<AvatarProps>(), {
  class: "",
});

const imgEl = useTemplateRef("img-ref");
const hasLoaded = ref<boolean | null>(null);

const loadHandler = () => (hasLoaded.value = true);

const errorHandler = () => (hasLoaded.value = false);

onMounted(() => {
  if (imgEl.value) {
    imgEl.value.addEventListener("load", loadHandler);
    imgEl.value.addEventListener("error", errorHandler);
  }
});

onBeforeMount(() => {
  if (imgEl.value) {
    imgEl.value.addEventListener("load", loadHandler);
    imgEl.value.addEventListener("error", errorHandler);
  }
});
</script>

<template>
  <button
    :class="
      cn(
        'size-[52px] rounded-full overflow-hidden flex-center bg-main-purple-300 text-white text-xl cursor-pointer transition-transform active:scale-95 relative',
        class {}
      )
    "
  >
    <img
      v-if="hasLoaded !== false"
      :class="[
        'absolute inset-0 size-full object-fill',
        hasLoaded === true ? 'z-0' : '-z-10',
      ]"
      :src="src"
      :alt="alt"
      ref="img-ref"
    />
    <div
      v-if="hasLoaded !== true"
      :class="{
        'z-0 absolute size-full inset-0 flex-center': true,
        'animate-pulse': hasLoaded === null,
      }"
    >
      {{ name[0].toUpperCase() }}
    </div>
  </button>
</template>
