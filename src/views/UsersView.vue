<script setup lang="ts">
import { ref } from "vue";

import { useDebounce } from "@/hooks/useDebounce";

import UsersFilter from "@/components/shared/Filter/Filter.vue";

import { userSortOption, userCategories } from "@/constants/users";

import { UserSortType } from "@/interfaces/users";
import { JobRolesEnum } from "@/interfaces";

const debouncedSearch = useDebounce("");

const isLoading = ref<boolean>(true);
const sortBy = ref<UserSortType>(userSortOption[0].value);
const category = ref<JobRolesEnum | undefined>(undefined);
const search = ref("");

const handleCategoryChange = (newCategory: string | undefined) =>
  (category.value = newCategory as JobRolesEnum);

const handleSortUpdate = (newSortBy: string) =>
  (sortBy.value = newSortBy as UserSortType);

const handleSearch = (newInput: string) => {
  debouncedSearch.value = newInput;
  search.value = newInput;
};
</script>

<template>
  <UsersFilter
    :search="search"
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
