<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";

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

import { Plus } from "lucide-vue-next";

import { getProjects } from "@/api/projects";

import {
  IProject,
  projectsType as projectsFetchType,
} from "@/interfaces/projects";

const isLoading = ref<boolean>(true);

const projects = ref<IProject[]>([]);
const filteredProjects = ref<IProject[]>([]);

const projectsType = ref<projectsFetchType>("all");
const search = ref<string>("");

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

onBeforeMount(async () => {
  await fetchProjects();
});

watch(projectsType, async () => {
  await fetchProjects();
});

watch(search, () => {
  if (!search.value) return;

  filteredProjects.value = projects.value.filter((proj) =>
    proj.name.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>

<template>
  <section class="flex flex-col gap-4 p-6 md:p-8 h-full">
    <h3 class="text-xl sm:text-2xl font-semibold text-main-black">Projects</h3>
    <div
      class="flex flex-col gap-5 bg-white rounded-lg-max h-[calc(100vh-228px)] border border-[#F5F5F7] overflow-hidden drop-shadow-sm"
    >
      <div class="p-5 pb-0 flex gap-2 justify-between flex-col sm:flex-row">
        <div class="flex gap-2 flex-col sm:flex-row">
          <SearchInput
            @search-input="(val) => (search = val)"
            placeholder="Search by name"
            class="!h-11"
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
        <Button>
          <Plus />
          Create new project
        </Button>
      </div>
      <ProjectsTable :projects :filteredProjects :is-loading :search />
    </div>
  </section>
</template>
