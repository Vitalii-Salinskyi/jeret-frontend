import { IUser } from "@/interfaces/users";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionStore = defineStore("session", () => {
  const user = ref<IUser | null>(null);

  const updateUser = (newUser: Partial<IUser>) => {
    if (user.value === null) {
      user.value = newUser as IUser;
    } else {
      user.value = {
        ...user.value,
        ...newUser,
      };
    }
  };

  return {
    user,
    updateUser,
  };
});
