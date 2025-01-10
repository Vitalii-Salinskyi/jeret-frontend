<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
} from "vue";

import { positionType } from "@/interfaces";

interface DropdownProps {
  position?: positionType;
  offset?: number;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  position: "bottom",
  offset: 6,
});

const emit = defineEmits<{
  (event: "update:is-open", isOpen: boolean): void;
}>();

let resizeTimeout: NodeJS.Timeout;

const trigger = useTemplateRef<HTMLElement>("trigger");
const dropdown = useTemplateRef<HTMLElement>("dropdown");

const isOpen = ref(false);

const dropdownStyle = computed(() => {
  const { left, top } = calculatePosition();

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
});

const getAvailableSpace = (
  triggerRect: DOMRect
): Record<positionType, number> => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  return {
    top: triggerRect.top,
    bottom: viewportHeight - triggerRect.bottom,
    left: triggerRect.left,
    right: viewportWidth - triggerRect.right,
  };
};

const getPositionPriority = (preferred: positionType): positionType[] => {
  const properties: Record<positionType, positionType[]> = {
    bottom: ["bottom", "top", "right", "left"],
    top: ["top", "bottom", "right", "left"],
    left: ["left", "right", "bottom", "top"],
    right: ["right", "left", "bottom", "top"],
  };

  return properties[preferred];
};

const calculatePosition = (): {
  top: number;
  left: number;
} => {
  if (!trigger.value || !dropdown.value) {
    return { top: 0, left: 0 };
  }

  const triggerRect = trigger.value.getBoundingClientRect();
  const dropdownRect = dropdown.value.getBoundingClientRect();
  const space = getAvailableSpace(triggerRect);
  const positions = getPositionPriority(props.position);

  for (const pos of positions) {
    let hasSpace = false;

    switch (pos) {
      case "bottom":
      case "top":
        hasSpace = space[pos] >= dropdownRect.height + props.offset;
        break;
      case "left":
      case "right":
        hasSpace = space[pos] >= dropdownRect.width + props.offset;
        break;
    }

    if (hasSpace || pos === positions[positions.length - 1]) {
      switch (pos) {
        case "bottom":
          return {
            top: triggerRect.bottom + props.offset,
            left: triggerRect.left,
          };
        case "top":
          return {
            top: triggerRect.top - dropdownRect.height - props.offset,
            left: triggerRect.left,
          };
        case "right":
          return {
            top: triggerRect.top,
            left: triggerRect.right + props.offset,
          };
        case "left":
          return {
            top: triggerRect.top,
            left: triggerRect.left - dropdownRect.width - props.offset,
          };
      }
    }
  }

  return {
    top: triggerRect.bottom + props.offset,
    left: triggerRect.left,
  };
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  emit("update:is-open", isOpen.value);

  if (isOpen.value) {
    nextTick(updatePosition);
  }
};

const updatePosition = () => {
  if (!isOpen.value) return;

  if (dropdown.value) {
    const { left, top } = calculatePosition();

    dropdown.value.style.top = `${top}px`;
    dropdown.value.style.left = `${left}px`;
  }
};

const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updatePosition, 10);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  document.addEventListener("scroll", handleResize, true);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("scroll", handleResize, true);
});
</script>

<template>
  <div>
    <div ref="trigger" @click="toggleDropdown">
      <slot name="trigger" />
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdown"
        :style="dropdownStyle"
        class="fixed bg-white border border-gray-200 shadow-lg rounded-md p-4 w-[224px]"
      >
        <slot name="content" />
      </div>
    </Teleport>
  </div>
</template>
