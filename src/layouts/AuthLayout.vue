<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { RouterView, useRouter } from "vue-router";

import Spinner from "@/components/ui/Spinner.vue";

import { Copyright } from "lucide-vue-next";

import { getProfile } from "@/api/users";
import { useSessionStore } from "@/stores/sessionStore";

const sessionStore = useSessionStore();
const router = useRouter();

const isLoading = ref(true);

onBeforeMount(async () => {
  const { status, data } = await getProfile();

  if (status === "success") {
    sessionStore.updateUser(data);
    if (!data.profile_completed) {
      router.push("/auth/profile");
    } else {
      router.push("/");
    }
  } else {
    router.push("/auth");
  }

  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading" class="size-full bg-white">
    <Spinner size-class="size-14" inner-class="text-main-purple-200" />
  </div>

  <main class="flex min-h-screen bg-white" v-else>
    <div class="flex flex-col flex-1 px-5 sm:px-9">
      <div class="hidden md:flex items-center gap-2 pt-9 pb-3">
        <div class="size-2.5 bg-[#4A4543] rounded-full"></div>
        <h2 class="text-[#4A4543] font-semibold text-xl">Jeret</h2>
      </div>
      <section class="flex-1 flex-center flex-col gap-6 py-6 md:py-0">
        <div
          class="relative flex-center md:hidden max-w-[121px] w-full mx-auto"
        >
          <div class="size-[72px] bg-main-purple-500 rounded-full">
            <div
              class="absolute bg-white/65 backdrop-blur-md top-1/2 left-0 right-0 mx-auto bottom-0 w-[121px] h-[60px]"
            ></div>
          </div>
        </div>
        <RouterView />
      </section>
      <div class="hidden md:flex items-center gap-1.5 pb-9 pt-3 text-[#808080]">
        <Copyright class="size-3.5" />
        <h3 class="font">Jeret {{ new Date().getFullYear() }}</h3>
      </div>
    </div>
    <div
      class="flex-1 bg-main-purple-100 overflow-hidden hidden md:flex-center"
    >
      <div class="relative flex-center max-w-[469px] w-full">
        <div class="size-[260px] bg-main-purple-500 rounded-full">
          <div
            class="absolute bg-main-purple-100/45 backdrop-blur-md scale-x-110 top-1/2 left-0 right-0 mx-auto bottom-0 w-[469px] h-[217px]"
          ></div>
        </div>
      </div>
    </div>
  </main>
</template>
