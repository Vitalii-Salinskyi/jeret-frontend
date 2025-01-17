<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";

import { useToast } from "@/components/ui/toast";

import CreateProjectModal from "@/components/shared/projects/CreateOrUpdateProjectModal.vue";
import ProjectsTable from "@/components/shared/projects/ProjectsTable.vue";
import SearchInput from "@/components/ui/SearchInput.vue";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Plus, X } from "lucide-vue-next";

import { deleteProject, getProjects } from "@/api/projects";

import {
  IProject,
  projectsType as projectsFetchType,
} from "@/interfaces/projects";

const { toast } = useToast();

const isLoading = ref<boolean>(true);

const projects = ref<IProject[]>([]);
const filteredProjects = ref<IProject[]>([]);

const isRemovePopupOpen = ref<boolean>(false);
const selectedProjectsLength = ref(0);
const clearSelectedProjects = ref(false);

const projectsType = ref<projectsFetchType>("all");
const search = ref<string>("");

const modalType = ref<"create" | "update" | null>(null);
const projectToUpdate = ref<IProject | null>(null);

const fetchProjects = async () => {
  isLoading.value = true;

  try {
    const res = await getProjects(projectsType.value);

    if (res.status === "failure") return;

    projects.value = res.data;
  } finally {
    isLoading.value = false;
  }
};

const filterProjects = (search: string) => {
  filteredProjects.value = projects.value.filter((proj) =>
    proj.name.toLowerCase().includes(search.toLowerCase())
  );
};

onBeforeMount(async () => {
  await fetchProjects();
});

watch(projectsType, async () => {
  await fetchProjects();
});

watch(search, () => {
  if (!search.value) return;

  filterProjects(search.value);
});

const updateDeleteModal = (val: boolean) => {
  isRemovePopupOpen.value = val;
};

const handleProjectCreate = (newProject: IProject) => {
  projects.value.push(newProject);

  filterProjects(search.value);
};

const handleProjectUpdate = (project: IProject, newName: string) => {
  const projectIndex = projects.value.findIndex((p) => p.id === project.id);

  if (projectIndex === -1) return;

  projects.value[projectIndex].name = newName;
};

const handleProjectRemove = async (project: IProject) => {
  projects.value = projects.value.filter((p) => p.id !== project.id);

  filterProjects(search.value);

  const res = await deleteProject(project.id);

  if (res.status === "failure") {
    projects.value.push(project);
    toast({
      title: "Failed to delete the project",
      description: res.data as unknown as string,
      variant: "destructive",
    });
    return;
  }
};

const openUpdateModal = (project: IProject) => {
  modalType.value = "update";
  projectToUpdate.value = project;
};

const handleModalClose = (isOpen: boolean) => {
  if (!isOpen) {
    modalType.value = null;
    projectToUpdate.value = null;
  }
};

const handleSelectedProjectsUpdate = (
  type: "increase" | "decrease",
  val?: number,
  updateByValueType?: "stack" | "set"
) => {
  if (val === undefined) {
    type === "increase"
      ? selectedProjectsLength.value++
      : selectedProjectsLength.value--;
  } else {
    if (type === "decrease" && updateByValueType === "set" && val === 0) {
      clearSelectedProjects.value = false;
    }

    if (updateByValueType === "set") {
      selectedProjectsLength.value = val;
    } else if (updateByValueType === "stack") {
      if (type === "increase") {
        selectedProjectsLength.value = selectedProjectsLength.value + val;
      } else {
        selectedProjectsLength.value = selectedProjectsLength.value - val;
      }
    }
  }
};
</script>

<template>
  <section class="flex flex-col gap-4 p-6 md:p-8 h-full">
    <h3 class="text-xl sm:text-2xl font-semibold text-main-black">Projects</h3>
    <div
      class="flex flex-col gap-5 bg-white rounded-lg-max h-[calc(100vh-228px)] border border-[#F5F5F7] overflow-hidden drop-shadow-sm"
    >
      <div class="p-5 pb-0 flex gap-2 justify-between flex-col sm:flex-row">
        <div class="flex gap-2 flex-col sm:flex-row">
          <div
            :class="{
              'flex items-center gap-1.5 justify-between sm:w-[247px] h-11': true,
              'opacity-0 pointer-events-none !w-0 !h-0':
                !selectedProjectsLength,
            }"
          >
            <div class="flex items-center gap-3">
              <button>
                <X
                  @click="clearSelectedProjects = true"
                  class="text-red-500 size-5 scale-click"
                />
              </button>
              <p>
                <span class="text-main-purple-500 font-medium">
                  {{ selectedProjectsLength }}
                </span>
                selected
              </p>
            </div>
            <Button
              @click="isRemovePopupOpen = true"
              class="bg-red-500/80 text-white hover:bg-red-500 scale-click h-7 px-2"
            >
              Remove all
            </Button>
          </div>
          <SearchInput
            @search-input="(val) => (search = val)"
            placeholder="Search by name"
            :class="{
              '!h-11': true,
              'opacity-0 pointer-events-none !w-0 !h-0': selectedProjectsLength,
            }"
            :search
          />
          <Select v-model="projectsType">
            <SelectTrigger class="w-full sm:w-[85px] border-[#F5F5F7]">
              <SelectValue placeholder="Select a job role" />
            </SelectTrigger>
            <SelectContent class="dropdown-animation max-h-[225px]">
              <SelectItem
                v-for="type in ['all', 'own']"
                :value="type"
                :key="type"
              >
                {{ type }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CreateProjectModal
          @project-update="handleProjectUpdate"
          @project-create="handleProjectCreate"
          @close="handleModalClose"
          :project="projectToUpdate"
          :type="modalType"
        >
          <Button @click="() => (modalType = 'create')">
            <Plus />
            Create new project
          </Button>
        </CreateProjectModal>
      </div>
      <ProjectsTable
        @set-projects="(newProjects) => (projects = newProjects)"
        @update:selected-length="handleSelectedProjectsUpdate"
        @update:delete-modal="updateDeleteModal"
        @remove-project="handleProjectRemove"
        @open-update-modal="openUpdateModal"
        :selected-projects-length
        :clear-selected-projects
        :is-remove-popup-open
        :filtered-projects
        :projects-type
        :is-loading
        :projects
        :search
      />
    </div>
  </section>
</template>
