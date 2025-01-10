<script setup lang="ts">
import Input from "./input/Input.vue";

import { cn } from "@/lib/utils";
import { Search } from "lucide-vue-next";

interface SearchInputProps {
  className?: string | string[] | Record<string, boolean>;
  type?: HTMLInputElement["type"];
  placeholder?: string;
  inputClass?: string;
  search: string;
}

withDefaults(defineProps<SearchInputProps>(), {
  placeholder: "Search",
  type: "text",
  className: "",
  inputClass: "",
});

const emit = defineEmits<{
  (event: "search-input", input: string): void;
}>();
</script>

<template>
  <div :class="cn('relative h-[52px]', className)">
    <Input
      :class="
        cn(
          'border-[#F5F5F7] placeholder:text-[#54577A] placeholder:text-sm pr-12 text-sm h-full rounded-lg-max',
          inputClass
        )
      "
      @update:model-value="(e) => emit('search-input', e as string)"
      :placeholder="placeholder"
      :value="search"
      :type
    />
    <Search
      class="absolute right-6 top-1/2 -translate-y-1/2 size-5 text-[#8E92BC]"
    />
  </div>
</template>
