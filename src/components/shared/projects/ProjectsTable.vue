<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { useSessionStore } from "@/stores/sessionStore";

import ProjectsTableItem from "./ProjectsTableItem.vue";
import ProjectsTableItemSkeleton from "./ProjectsTableItemSkeleton.vue";

import Checkbox from "@/components/ui/checkbox/Checkbox.vue";

import {
  IProject,
  projectsType as projectsFetchType,
} from "@/interfaces/projects";

interface ProjectsTableProps {
  projects: IProject[];
  selectedProjectsLength: number;
  projectsType: projectsFetchType;
  filteredProjects: IProject[];
  clearSelectedProjects: boolean;
  isLoading: boolean;
  search: string;
}

const props = defineProps<ProjectsTableProps>();

const emit = defineEmits<{
  (event: "open-update-modal", project: IProject): void;
  (event: "remove-project", project: IProject): void;
  (
    event: "update:selected-length",
    type: "increase" | "decrease",
    value?: number,
    updateByValueType?: "stack" | "set"
  ): void;
}>();

const sessionStore = useSessionStore();

const selectedProjectsSet = ref<Set<number>>(new Set());
const lastUpdatedCheckbox = ref<{
  id: number;
  index: number;
  checked: boolean;
} | null>(null);

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

const unselectEverything = () => {
  selectedProjectsSet.value.clear();
  lastUpdatedCheckbox.value = null;
  emit("update:selected-length", "decrease", 0, "set");
};

const selectEverything = () => {
  lastUpdatedCheckbox.value = null;
  const newIds = new Set(projectsToDisplay.value.map((p) => p.id));

  selectedProjectsSet.value = new Set([...newIds]);

  emit(
    "update:selected-length",
    "increase",
    selectedProjectsSet.value.size,
    "set"
  );
};

const handleSelectProject = (
  id: number,
  index: number,
  isShiftPressed: boolean
) => {
  if (!isShiftPressed || !lastUpdatedCheckbox.value) {
    const lastCheckData = { id, index, checked: false };

    if (selectedProjectsSet.value.has(id)) {
      selectedProjectsSet.value.delete(id);
      emit("update:selected-length", "decrease");

      lastCheckData.checked = false;
    } else {
      selectedProjectsSet.value.add(id);
      emit("update:selected-length", "increase");

      lastCheckData.checked = true;
    }

    lastUpdatedCheckbox.value = lastCheckData;
  } else {
    updateMultipleCheckboxes(id, index);
  }
};

const updateMultipleCheckboxes = (id: number, index: number) => {
  let sliceRange = null;

  const isCurrentItemIndexHigher = lastUpdatedCheckbox.value!.index < index;
  let isCurrentCheckboxChecked = selectedProjectsSet.value.has(id);

  if (isCurrentItemIndexHigher) {
    sliceRange = { start: lastUpdatedCheckbox.value!.index, end: index + 1 };
  } else {
    sliceRange = { start: index, end: lastUpdatedCheckbox.value!.index + 1 };
  }

  const projectsIndexRange = projectsToDisplay.value
    .slice(sliceRange.start, sliceRange.end)
    .map((p) => p.id);

  const currentlySelectedInRange = projectsIndexRange.filter((id) =>
    selectedProjectsSet.value.has(id)
  ).length;

  projectsIndexRange.forEach((projectId) => {
    if (isCurrentCheckboxChecked) {
      selectedProjectsSet.value.delete(projectId);
    } else {
      selectedProjectsSet.value.add(projectId);
    }
  });

  const totalItemsInRange = projectsIndexRange.length;
  let netChange: number;

  if (isCurrentCheckboxChecked) {
    netChange = -currentlySelectedInRange;
  } else {
    netChange = totalItemsInRange - currentlySelectedInRange;
  }

  emit(
    "update:selected-length",
    netChange > 0 ? "increase" : "decrease",
    Math.abs(netChange),
    "stack"
  );

  lastUpdatedCheckbox.value = {
    id,
    index,
    checked: isCurrentCheckboxChecked,
  };
};

watch(
  [
    () => props.projectsType,
    () => props.search,
    () => props.clearSelectedProjects,
  ],
  () => {
    unselectEverything();
    lastUpdatedCheckbox.value = null;
  }
);
</script>

<template>
  <div class="overflow-x-auto size-full">
    <table
      class="table-fixed border-collapse text-main-black w-[700px] md:w-full overflow-y-auto"
    >
      <thead class="bg-main-purple-100/20 border-y border-purple-100">
        <tr>
          <th class="w-14">
            <Checkbox
              :checked="selectedProjectsLength > 0"
              @update:checked="
                selectedProjectsLength >= projectsToDisplay.length
                  ? unselectEverything()
                  : selectEverything()
              "
              :class="{
                'size-4 p-px rounded-sm': true,
                'data-[state=checked]:bg-transparent data-[state=checked]:text-main-black':
                  selectedProjectsLength > 0 &&
                  selectedProjectsLength < projectsToDisplay.length,
              }"
            />
          </th>
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
          v-else-if="hasProjectsToDisplay"
          v-for="(project, index) in projectsToDisplay"
          @check-update="
            (id, isShiftPressed) =>
              handleSelectProject(id, index, isShiftPressed)
          "
          @remove-project="emit('remove-project', project)"
          @open-update-modal="(proj) => emit('open-update-modal', proj)"
          :selected-projects-set
          :last-updated-checkbox
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
