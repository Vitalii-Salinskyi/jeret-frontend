<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useToast } from "@/components/ui/toast";

import Spinner from "@/components/ui/Spinner.vue";

import { getUserLocationAndDeviceInfo } from "@/utils/navigator";
import { setTokens } from "@/utils/tokens";

import { authorizeGoogle } from "@/api/auth";

import { AuthTokens, GoogleAuthDto } from "@/interfaces/auth";

const router = useRouter();
const route = useRoute();
const { toast } = useToast();

const { code } = route.query;

onBeforeMount(async () => {
  if (!code) {
    router.replace("/auth");
    return;
  }

  try {
    if (!("geolocation" in navigator)) {
      toast({
        title: "Authentication Failed",
        description:
          "Geolocation is not supported by your browser. Please use a browser that supports geolocation.",
        variant: "destructive",
      });
      router.replace("/auth");
      return;
    }

    const locationAndDevice = await getUserLocationAndDeviceInfo();

    if (locationAndDevice.hasOwnProperty("error")) {
      toast({
        title: "Authentication Failed",
        description: locationAndDevice.error,
        variant: "destructive",
      });
      router.replace("/auth");
      return;
    }

    const { status, data } = await authorizeGoogle({
      code,
      ...locationAndDevice,
    } as GoogleAuthDto);

    if (status === "failure") {
      toast({
        title: "Authentication Failed",
        description: data,
        variant: "destructive",
      });
      router.replace("/auth");
      return;
    }

    setTokens(data as AuthTokens);
  } catch (error) {
    router.replace("/auth");
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
