<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/components/ui/toast";

import Button from "@/components/ui/button/Button.vue";
import Select from "@/components/ui/select/Select.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";

import { jobRoles } from "@/constants";

import { updateUserData } from "@/api/users";

import { JobRolesEnum } from "@/interfaces";
import { useSessionStore } from "@/stores/sessionStore";
import Spinner from "@/components/ui/Spinner.vue";
import { Textarea } from "@/components/ui/textarea";

const sessionStore = useSessionStore();
const { toast } = useToast();
const router = useRouter();

const role = ref<JobRolesEnum | undefined>(undefined);
const description = ref("");
const isLoading = ref<boolean>(false);

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    if (role.value === undefined || description.value.trim().length < 50) {
      toast({
        title: "Submission failed",
        description:
          "Please select a role and provide a description with at least 50 characters long.",
        variant: "destructive",
      });
      return;
    }

    const { status } = await updateUserData({
      job_role: role.value,
      description: description.value,
    });

    if (status === "failure") {
      toast({
        title: "Something went wrong... Try again",
        variant: "destructive",
      });
      return;
    }

    sessionStore.updateUser({ profile_completed: true, job_role: role.value });
    router.push("/");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form
    class="flex flex-col max-w-[360px] w-full gap-5"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col gap-3 text-center md:text-left">
      <h1 class="text-[2.625rem] leading-tight text-main-black">
        Set up your profile
      </h1>
      <p class="text-base text-[#808080] tracking-wide">
        Choose a role and provide a brief description!
      </p>
    </div>
    <div class="flex flex-col gap-5 perspective">
      <div class="flex flex-col gap-2">
        <label class="text-main-black text-sm font-medium">Role</label>
        <Select v-model="role">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select a job role" />
          </SelectTrigger>
          <SelectContent class="dropdown-animation max-h-[225px]">
            <SelectItem v-for="role in jobRoles" :value="role" :key="role">
              {{ role }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-main-black text-sm font-medium">Description</label>
        <div class="flex flex-col gap-1.5">
          <Textarea
            v-model:model-value="description"
            placeholder="Tell about yourself"
            class="max-h-[275px]"
          />
          <span class="text-xs font-medium text-gray-500">
            {{ description.length }}/50
          </span>
        </div>
      </div>
      <Button class="text-base relative" :disabled="isLoading">
        <template v-if="!isLoading">Continue</template>
        <Spinner v-else color-class="fill-main-purple-800" />
      </Button>
    </div>
  </form>
</template>
