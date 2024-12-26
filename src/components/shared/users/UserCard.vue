<script setup lang="ts">
import Avatar from "@/components/ui/Avatar.vue";
import { IUser } from "@/interfaces/users";

interface UserCardProps {
  user: IUser;
  followMap: Record<number, boolean>;
  withDescription?: boolean;
}

withDefaults(defineProps<UserCardProps>(), {
  withDescription: false,
});

const emit = defineEmits<{
  (event: "follow-update", data: { id: number; status: boolean }): void;
}>();
</script>

<template>
  <div
    class="flex flex-col justify-between gap-5 min-h-[140px] rounded-lg-max p-6 bg-white drop-shadow-sm"
  >
    <div class="flex gap-5 items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="">
          <Avatar
            :name="user.name"
            :src="user.profile_picture"
            :alt="`${user.name}'s avatar'`"
            class="h-12 w-12 !cursor-default"
          />
        </div>
        <div class="flex flex-col gap-1">
          <h4
            class="text-main-black font-semibold text-sm min-[375px]:text-base"
          >
            {{ user.name }}
          </h4>
          <strong class="text-[#54577A] text-xs font-normal">
            {{ user.job_role }}
          </strong>
        </div>
      </div>
      <button
        class="text-main-purple-500 font-medium text-nowrap text-sm transition-transform active:scale-95"
        @click="
          emit('follow-update', { id: user.id, status: followMap[user.id] })
        "
      >
        {{ followMap[user.id] ? "Followed" : "+ Follow" }}
      </button>
    </div>

    <p
      class="text-sm font-medium leading-[200%] text-[#8E92BC] line-clamp-2 h-[56px]"
      v-if="withDescription"
    >
      {{ user.description }}
    </p>

    <div class="flex justify-between text-main-black font-medium text-sm">
      <div class="flex items-center gap-2">
        <img
          src="@/assets/icons/users/tasks-done.svg"
          alt="start icon"
          width="24"
          height="24"
        />
        {{ user.tasks_completed }} Tasks
      </div>
      <div class="flex items-center gap-2">
        <img
          src="@/assets/icons/users/star.svg"
          alt="start icon"
          width="24"
          height="24"
        />
        {{
          `${user.rating.toFixed(1).replace(".", ",")} (${
            user.review_count
          } Reviews)`
        }}
      </div>
    </div>
  </div>
</template>
