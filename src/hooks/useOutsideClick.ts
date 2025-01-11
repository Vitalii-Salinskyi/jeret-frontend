import { type Ref, useTemplateRef, onMounted, onUnmounted } from "vue";

interface UseOutsideClickProps<T> {
  templateRefName: string;
  shown?: Ref<T>;
  closeHandler?: () => void;
  additionalElements?: Ref<HTMLElement | null>[];
}

export const useOutsideClick = <T>({
  templateRefName,
  shown,
  closeHandler,
  additionalElements = [],
}: UseOutsideClickProps<T>) => {
  const elRef = useTemplateRef<HTMLElement>(templateRefName);

  const handleOutsideClick = (event: Event) => {
    const isOutsideMainElement =
      elRef.value && !elRef.value.contains(event.target as Node);

    const isOutsideAdditionalElements = additionalElements.every(
      (elementRef) =>
        !elementRef.value || !elementRef.value.contains(event.target as Node)
    );

    if (isOutsideMainElement && isOutsideAdditionalElements) {
      if (closeHandler) {
        closeHandler();
      } else if (shown && typeof shown.value === "boolean") {
        shown.value = false as T;
      }
    }
  };

  onMounted(() => document.addEventListener("mousedown", handleOutsideClick));

  onUnmounted(() =>
    document.removeEventListener("mousedown", handleOutsideClick)
  );

  return {
    elRef,
  };
};
