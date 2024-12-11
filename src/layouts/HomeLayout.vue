<script setup lang="ts">
import Sidebar from "@/components/shared/Sidebar/Sidebar.vue";
</script>

<template>
  <main class="flex">
    <Sidebar />
    <header></header>
    <div class="bg-[#FAFAFA] flex-1">
      <RouterView />
    </div>
  </main>
</template>
