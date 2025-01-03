<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useSessionStore } from "@/stores/sessionStore";
import { useToast } from "@/components/ui/toast";

import Header from "@/components/shared/Header.vue";
import Sidebar from "@/components/shared/Sidebar/Sidebar.vue";
import Spinner from "@/components/ui/Spinner.vue";

import { getProfile } from "@/api/users";

import { headerVariants } from "@/constants/nav";
import { useSocketStore } from "@/stores/socketStore";

const sessionStore = useSessionStore();
const socketStore = useSocketStore();

const { toast } = useToast();
const router = useRouter();
const route = useRoute();

const isLoading = ref<boolean>(true);

onBeforeMount(async () => {
  try {
    let user = sessionStore.user;

    if (!user) {
      const { status, data } = await getProfile();

      if (status === "failure") {
        toast({
          title: "Session error, redirecting to login",
          variant: "destructive",
        });
        router.push("/auth");
        return;
      }

      sessionStore.updateUser(data);
      socketStore.connect(data.id);
      user = data;
    }

    if (!user.profile_completed) {
      router.push("/auth");
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div v-if="isLoading" class="size-full bg-white">
    <Spinner size-class="size-14" inner-class="text-main-purple-200" />
  </div>

  <main class="flex" v-else>
    <Sidebar />
    <div class="flex flex-col relative flex-1 overflow-auto">
      <Header
        v-if="route.name !== 'Dashboard'"
        v-bind="headerVariants[route.name as string]"
        :section-name="route.name as string"
      />
      <main class="bg-[#FAFAFA] flex-1">
        <RouterView />
      </main>
    </div>
  </main>
</template>
