import { type Ref, useTemplateRef, onMounted, onUnmounted } from "vue";

interface UseOutsideClickProps<T> {
  templateRefName: string;
  shown?: Ref<T>;
  closeHandler?: () => void;
}

export const useOutsideClick = <T>({
  templateRefName,
  shown,
  closeHandler,
}: UseOutsideClickProps<T>) => {
  const elRef = useTemplateRef<HTMLElement>(templateRefName);

  const defaultCloseHandler = () => {
    if (shown && typeof shown.value === "boolean") {
      shown.value = false as T;
    }
  };

  const handleOutsideClick = (event: Event) => {
    if (elRef.value && !elRef.value.contains(event.target as Node)) {
      (shown && shown.value
        ? closeHandler ?? defaultCloseHandler
        : closeHandler!)();
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
