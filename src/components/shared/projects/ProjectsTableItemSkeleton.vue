<script setup lang="ts">
import { EllipsisVertical, User } from "lucide-vue-next";

import { TASK_TYPES } from "@/constants/projects";

import { TaskType } from "@/interfaces/projects";
</script>

<template>
  <tr class="text-lg border-b">
    <td class="pl-5 pr-3.5">
      <div class="size-4 rounded-sm animate-pulse bg-main-purple-500/30" />
    </td>
    <td class="p-3 pl-0">
      <div
        class="h-6 max-w-[200px] rounded-sm animate-pulse bg-main-purple-500/30"
      />
    </td>
    <td class="p-3 pl-5">
      <div class="flex items-center gap-1.5">
        <User class="text-main-purple-400" />
        <div
          class="size-[18px] rounded-sm animate-pulse bg-main-purple-500/30"
        />
      </div>
    </td>
    <td class="p-3 pl-5">
      <div class="flex items-center gap-1.5">
        <div
          v-for="task in Object.keys(TASK_TYPES)"
          :style="{backgroundColor: `${TASK_TYPES[task as TaskType].color}50`, color: TASK_TYPES[task as TaskType].color}"
          class="flex-center text-red-500 rounded-md text-base py-1.5 px-2 size-[35px] animate-pulse"
        ></div>
      </div>
    </td>
    <td class="pr-5">
      <div class="w-min">
        <button
          class="transition-colors hover:bg-gray-100 p-1 rounded-md cursor-wait"
        >
          <EllipsisVertical />
        </button>
      </div>
    </td>
  </tr>
</template>
