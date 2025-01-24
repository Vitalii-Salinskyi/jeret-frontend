<script setup lang="ts">
import { computed } from "vue";

import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import Dropdown from "@/components/ui/Dropdown.vue";

import {
  EllipsisVertical,
  ExternalLink,
  FilePenLine,
  Trash2,
  User,
} from "lucide-vue-next";

import { TASK_TYPES } from "@/constants/projects";

import { IProject, TaskType } from "@/interfaces/projects";

interface ProjectsTableItemProps {
  selectedProjectsSet: Set<number>;
  project: IProject;
  userId: number;
}

const props = defineProps<ProjectsTableItemProps>();

const emit = defineEmits<{
  (event: "remove-project", project: IProject): void;
  (event: "open-update-modal", project: IProject): void;
  (event: "check-update", id: number, isShiftPressed: boolean): void;
}>();

let isShiftPressed = false;

const isOwnProject = computed(() => props.userId === props.project.owner_id);

const handleCheckUpdate = () => {
  emit("check-update", props.project.id, isShiftPressed);
};

const handleMouseDown = (event: MouseEvent) => {
  isShiftPressed = event.shiftKey;
};
</script>

<template>
  <tr class="text-lg border-b">
    <td class="pl-5 pr-3.5">
      <Checkbox
        :checked="selectedProjectsSet.has(project.id)"
        @mousedown="handleMouseDown"
        @update:checked="handleCheckUpdate"
        class="size-4 p-px rounded-sm"
      />
    </td>
    <td class="p-3 pl-0">
      <RouterLink
        :to="`/projects/${project.id}`"
        class="line-clamp-1 max-w-[250px] 2xl:max-w-none w-fit"
      >
        {{ project.name }}
      </RouterLink>
    </td>
    <td class="p-3 pl-5">
      <div class="flex items-center gap-1.5">
        <User class="text-main-purple-400" />
        {{ project.members_count }}
      </div>
    </td>
    <td class="p-3 pl-5">
      <div class="flex items-center gap-1.5">
        <div
          v-for="task in Object.keys(TASK_TYPES)"
          :style="{backgroundColor: `${TASK_TYPES[task as TaskType].color}20`, color: TASK_TYPES[task as TaskType].color}"
          class="flex-center text-red-500 rounded-md text-base py-1.5 px-2 min-w-[35px]"
        >
          {{ project.status[task as TaskType] }}
        </div>
      </div>
    </td>
    <td class="pr-5">
      <div class="w-min">
        <Dropdown
          side="left"
          align-x="center"
          :align-y="isOwnProject ? 'top' : 'center'"
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
                :to="`/projects/${project.id}`"
                class="text-main-black flex items-center justify-center gap-3 text-sm p-1.5 hover:bg-gray-100 transition-colors rounded-lg"
              >
                <ExternalLink width="17" />
                Open
              </RouterLink>

              <hr v-if="isOwnProject" />

              <button
                v-if="isOwnProject"
                @click="emit('open-update-modal', project)"
                class="text-main-black flex items-center justify-center gap-2 text-sm px-4 p-1.5 hover:bg-gray-100 transition-colors rounded-lg"
              >
                <FilePenLine width="17" />
                Update
              </button>

              <hr v-if="isOwnProject" />

              <button
                v-if="isOwnProject"
                @click="emit('remove-project', project)"
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
