<script setup lang="ts">
import ProjectsTableItem from "./ProjectsTableItem.vue";
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
          <th class="w-fit" />
        </tr>
      </thead>
      <tbody>
        <ProjectsTableItem v-for="_ in Array(3).fill(23)" />
      </tbody>
    </table>
  </div>
</template>
