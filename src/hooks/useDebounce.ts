import { customRef, ref } from "vue";

export const useDebounce = <T>(value: T, delay: number = 325) => {
  const debounceRef = ref(value);
  let timeoutId: NodeJS.Timeout;

  return customRef((track, trigger) => ({
    get() {
      track();
      return debounceRef.value;
    },
    set(value) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        debounceRef.value = value;
        trigger();
      }, delay);
    },
  }));
};
