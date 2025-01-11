<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
} from "vue";

import { useOutsideClick } from "@/hooks/useOutsideClick";

import { cn } from "@/lib/utils";

import { positionType } from "@/interfaces";

interface DropdownProps {
  side?: positionType;
  offset?: number;
  alignX?: "left" | "center" | "right";
  alignY?: "top" | "center" | "bottom";
  className?: string;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  side: "bottom",
  offset: 6,
  className: "",
  alignX: "left",
  alignY: "center",
});

const emit = defineEmits<{
  (event: "update:is-open", isOpen: boolean): void;
}>();

let resizeTimeout: NodeJS.Timeout;

const isOpen = ref(false);

const trigger = useTemplateRef<HTMLElement>("trigger");

const { elRef: dropdown } = useOutsideClick({
  templateRefName: "dropdown",
  shown: isOpen,
  additionalElements: [trigger],
  closeHandler() {
    if (isOpen.value) {
      toggleDropdown();
    }
  },
});

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
  const positions = getPositionPriority(props.side);

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
      let left = triggerRect.left;
      let top = triggerRect.top;

      switch (pos) {
        case "bottom":
        case "top":
          switch (props.alignX) {
            case "center":
              left =
                triggerRect.left +
                triggerRect.width / 2 -
                dropdownRect.width / 2;
              break;
            case "right":
              left = triggerRect.right - dropdownRect.width;
              break;
          }
          break;

        case "left":
        case "right":
          switch (props.alignY) {
            case "center":
              top =
                triggerRect.top +
                triggerRect.height / 2 -
                dropdownRect.height / 2;
              break;
            case "bottom":
              top = triggerRect.bottom - dropdownRect.height;
              break;
          }
          break;
      }

      switch (pos) {
        case "bottom":
          return {
            top: triggerRect.bottom + props.offset,
            left,
          };
        case "top":
          return {
            top: triggerRect.top - dropdownRect.height - props.offset,
            left,
          };
        case "right":
          return {
            top,
            left: triggerRect.right + props.offset,
          };
        case "left":
          return {
            top,
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
        ref="dropdown"
        :style="dropdownStyle"
        :class="[
          cn(
            'fixed bg-white border border-gray-200 drop-shadow-sm rounded-lg-max p-2.5 transition-opacity duration-200',
            className
          ),
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'pointer-events-none opacity-0',
        ]"
      >
        <slot name="content" />
      </div>
    </Teleport>
  </div>
</template>
