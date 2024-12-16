<script setup lang="ts">
import { ref, watch } from "vue";

import UsersFilter from "@/components/shared/Filter/Filter.vue";

import { userSortOption, userCategories } from "@/constants/users";

import { UserSortType } from "@/interfaces/users";
import { JobRolesEnum } from "@/interfaces";

const isLoading = ref<boolean>(true);
const sortBy = ref<UserSortType>(userSortOption[0].value);
const category = ref<JobRolesEnum | undefined>(undefined);
const input = ref("");

const handleCategoryChange = (newCategory: string | undefined) =>
  (category.value = newCategory as JobRolesEnum);

const handleSortUpdate = (newSortBy: string) =>
  (sortBy.value = newSortBy as UserSortType);

const handleSearch = (newInput: string) => (input.value = newInput);

watch([sortBy, category, input], () => {
  console.log(sortBy.value, category.value, input.value);
});
</script>

<template>
  <UsersFilter
    :input="input"
    :sort-by="sortBy"
    :category="category"
    :sort-options="userSortOption"
    :categories="userCategories"
    :is-loading="isLoading"
    placeholder="Search Users"
    sidebar-title="Users Filter"
    @sort-update="handleSortUpdate"
    @category-change="handleCategoryChange"
    @search-input="handleSearch"
  />
</template>
