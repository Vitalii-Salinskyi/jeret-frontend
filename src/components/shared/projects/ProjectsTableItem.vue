<script setup lang="ts">
import Dropdown from "@/components/ui/Dropdown.vue";

import { EllipsisVertical, ExternalLink, Trash2, User } from "lucide-vue-next";

import { TASK_TYPES } from "@/constants/projects";

import { TaskType } from "@/interfaces/projects";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
</script>

<template>
  <tr class="text-lg border-b">
    <td class="pl-5 pr-3.5">
      <Checkbox class="size-4 p-px rounded-sm" />
    </td>
    <td class="p-3 pl-0">
      <RouterLink
        :to="`/projects/${1}`"
        class="line-clamp-1 max-w-[250px] 2xl:max-w-none w-fit"
      >
        Super Cool Project Just WoW
      </RouterLink>
    </td>
    <td class="p-3 pl-5">
      <div class="flex items-center gap-1.5">
        <User class="text-main-purple-400" />
        3
      </div>
    </td>
    <td class="p-3 pl-5">
      <div class="flex items-center gap-1.5">
        <div
          v-for="task in Object.keys(TASK_TYPES)"
          :style="{backgroundColor: `${TASK_TYPES[task as TaskType].color}20`, color: TASK_TYPES[task as TaskType].color}"
          class="flex-center text-red-500 rounded-md text-base py-1.5 px-2"
        >
          31
        </div>
      </div>
    </td>
    <td class="pr-5">
      <div class="w-min">
        <Dropdown
          side="left"
          align-x="center"
          align-y="top"
          :offset="4"
          class-name="p-1.5"
        >
          <template #trigger>
            <button class="transition-colors hover:bg-gray-100 p-1 rounded-md">
              <EllipsisVertical />
            </button>
          </template>

          <template #content>
            <div class="flex flex-col gap-1 size-full">
              <RouterLink
                :to="`/projects/${1}`"
                class="text-main-black flex items-center justify-center gap-3 text-sm p-1.5 hover:bg-gray-100 transition-colors rounded-lg"
              >
                <ExternalLink width="17" />
                Open
              </RouterLink>
              <hr />
              <button
                class="text-red-500 flex items-center justify-center gap-2 text-sm px-4 p-1.5 hover:bg-gray-100 transition-colors rounded-lg"
              >
                <Trash2 width="17" />
                Remove
              </button>
            </div>
          </template>
        </Dropdown>
      </div>
    </td>
  </tr>
</template>
