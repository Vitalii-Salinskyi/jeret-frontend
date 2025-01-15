<script setup lang="ts">
import { InputHTMLAttributes, useAttrs } from "vue";

import Input from "@/components/ui/input/Input.vue";

interface AuthInputProps extends /* @vue-ignore */ InputHTMLAttributes {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
}

withDefaults(defineProps<AuthInputProps>(), {
  id: "",
  label: "",
  placeholder: "",
});

const attrs = useAttrs();
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="text-main-black text-sm font-medium">
      {{ label }}
    </label>
    <Input :id="id" :placeholder="placeholder" v-bind="attrs" />
    <span v-if="error" class="text-red-400">{{ error }}</span>
  </div>
</template>
