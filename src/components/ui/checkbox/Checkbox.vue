<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from "radix-vue";
import { cn } from "@/lib/utils";
import { Check } from "lucide-vue-next";
import {
  CheckboxIndicator,
  CheckboxRoot,
  useForwardPropsEmits,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
  CheckboxRootProps & { class?: HTMLAttributes["class"]; id: string }
>();
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, id, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <CheckboxRoot
    :id="id"
    v-bind="forwarded"
    :class="
      cn(
        'peer h-[14px] w-[14px] shrink-0 rounded-[0.125rem] border border-main-purple-900 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-main-purple-500 data-[state=checked]:text-primary-foreground',
        props.class
      )
    "
  >
    <CheckboxIndicator
      class="flex h-full w-full items-center justify-center text-current"
    >
      <slot>
        <Check class="h-[14px] w-[14px]" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
