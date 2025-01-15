<script setup lang="ts">
import { computed } from "vue";

import { useSessionStore } from "@/stores/sessionStore";

import ProjectsTableItem from "./ProjectsTableItem.vue";
import ProjectsTableItemSkeleton from "./ProjectsTableItemSkeleton.vue";

import { IProject } from "@/interfaces/projects";

interface ProjectsTableProps {
  projects: IProject[];
  filteredProjects: IProject[];
  isLoading: boolean;
  search: string;
}

const props = defineProps<ProjectsTableProps>();

const emit = defineEmits<{
  (event: "open-update-modal", project: IProject): void;
  (event: "remove-project", project: IProject): void;
}>();

const sessionStore = useSessionStore();

const isSearching = computed(() => props.search.length > 0);

const projectsToDisplay = computed(() => {
  return isSearching.value ? props.filteredProjects : props.projects;
});

const hasProjectsToDisplay = computed(
  () => !props.isLoading && projectsToDisplay.value.length
);

const emptyStateMessage = computed(() => {
  if (isSearching.value && !props.filteredProjects.length) {
    return `No projects match the name: ${props.search}`;
  }

  return "Get started by joining or creating your first project!";
});
</script>

<template>
  <div class="overflow-x-auto size-full">
    <table
      class="table-fixed border-collapse text-main-black w-[700px] md:w-full overflow-y-auto"
    >
      <thead class="bg-main-purple-100/20 border-y border-purple-100">
        <tr>
          <th class="w-14" />
          <th class="w-[29.5%] p-3 pl-0 font-medium text-base text-start">
            Project
          </th>
          <th class="w-[26.5%] p-3 pl-5 font-medium text-base text-start">
            Members
          </th>
          <th class="w-[32.5%] p-3 pl-[76px] font-medium text-base text-start">
            Tasks
          </th>
          <th class="w-[11.5%]" />
        </tr>
      </thead>
      <tbody>
        <ProjectsTableItemSkeleton
          v-if="isLoading"
          v-for="(_, index) in Array(5).fill(0)"
          :key="`skeleton-${index}`"
        />

        <ProjectsTableItem
          @remove-project="emit('remove-project', project)"
          @open-update-modal="(proj) => emit('open-update-modal', proj)"
          v-else-if="hasProjectsToDisplay"
          v-for="project in projectsToDisplay"
          :project
          :key="project.id"
          :user-id="sessionStore.user?.id as number"
        />

        <tr v-else>
          <td colspan="100%" class="text-center py-6 px-3">
            <h2
              :class="[
                'text-lg text-main-purple-500 font-medium',
                { 'mx-auto max-w-[325px] sm:max-w-none': !isSearching },
              ]"
            >
              {{ emptyStateMessage }}
            </h2>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
