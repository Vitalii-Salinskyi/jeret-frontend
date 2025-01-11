<script setup lang="ts">
import { ref } from "vue";

import ProjectsTable from "@/components/shared/projects/ProjectsTable.vue";
import SearchInput from "@/components/ui/SearchInput.vue";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-vue-next";

const search = ref("");
</script>

<template>
  <section class="flex flex-col gap-4 p-6 md:p-8 h-full">
    <h3 class="text-xl sm:text-2xl font-semibold text-main-black">Projects</h3>
    <div
      class="flex flex-col gap-5 bg-white rounded-lg-max h-[calc(100vh-228px)] border border-[#F5F5F7] overflow-hidden drop-shadow-sm"
    >
      <div
        class="p-5 pb-0 flex gap-2 justify-between flex-col min-[544px]:flex-row"
      >
        <SearchInput
          @search-input="(val) => (search = val)"
          placeholder="Search by name"
          class="!h-11"
          :search
        />
        <Button>
          <Plus />
          Create new project
        </Button>
      </div>
      <ProjectsTable />
    </div>
  </section>
</template>
