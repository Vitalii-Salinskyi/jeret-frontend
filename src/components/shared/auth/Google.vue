<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";

import Spinner from "@/components/ui/Spinner.vue";

import { getUserLocationAndDeviceInfo } from "@/utils/navigator";
import { setTokens } from "@/utils/tokens";

import { authorizeGoogle } from "@/api/auth";

import { AuthTokens } from "@/interfaces/auth";

const router = useRouter();
const route = useRoute();

const { code } = route.query;

if (!code) router.replace("/auth");

onBeforeMount(async () => {
  try {
    if (!("geolocation" in navigator)) {
      alert("Something went wrong!");
      router.replace("/auth");
      return;
    }

    const locationAndDevice = await getUserLocationAndDeviceInfo();

    const { status, data } = await authorizeGoogle({
      code: code as string,
      ...locationAndDevice,
    });

    if (status === "failure") {
      // router.replace("/auth");
      alert(data);
      return;
    }

    setTokens(data as AuthTokens);
  } catch (error) {
    console.log(error);
    throw error;
  }
});
</script>

<template>
  <Spinner
    size-class="size-14"
    inner-class="text-[#5A5560]"
    color-class="fill-[#7C3AED]"
  />
</template>
