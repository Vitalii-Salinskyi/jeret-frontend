<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { useWindowScroll } from "@vueuse/core";

import { useDebounce } from "@/hooks/useDebounce";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import UsersFilter from "@/components/shared/Filter/Filter.vue";
import UserCard from "@/components/shared/users/UserCard.vue";
import UserCardSkeleton from "@/components/shared/users/UserCardSkeleton.vue";

import { ChevronLeft, ChevronRight } from "lucide-vue-next";

import { userSortOption, userCategories } from "@/constants/users";

import { getRecentUsers, getUsers } from "@/api/users";

import { IUser, UserSortType } from "@/interfaces/users";
import { JobRolesEnum } from "@/interfaces";

const SCROLL_OFFSET = 100;
const USERS_PER_PAGE = 9;

const { y } = useWindowScroll();

const isNearBottom = computed(() => {
  if (typeof window === "undefined") return false;

  return (
    window.innerHeight + y.value >=
    document.documentElement.offsetHeight - SCROLL_OFFSET
  );
});

const debouncedSearch = useDebounce("");
const sortBy = ref<UserSortType>(userSortOption[0].value);
const category = ref<JobRolesEnum | undefined>(undefined);
const search = ref("");

const isLoading = ref<boolean>(true);
const initialLoading = ref(true);
const showUsersSkeletons = ref(false);
const currentPage = ref(1);

const recentUsers = ref<IUser[]>([]);

const paginatedUsers = reactive<{
  data: IUser[];
  page: number;
  totalPages: number;
  totalResults: number;
}>({
  data: [],
  page: 1,
  totalPages: 0,
  totalResults: 0,
});

const handleCategoryChange = (newCategory: string | undefined) => {
  newCategory === "reset"
    ? (category.value = undefined)
    : (category.value = newCategory as JobRolesEnum);
};

const handleSortUpdate = (newSortBy: string) =>
  (sortBy.value = newSortBy as UserSortType);

const handleSearch = (newInput: string) => {
  debouncedSearch.value = newInput;
  search.value = newInput;
};

const fetchPaginatedUsers = async (currentPage: number = 1) => {
  try {
    currentPage === 1
      ? (isLoading.value = true)
      : (showUsersSkeletons.value = true);

    const {
      data: { data, page, totalPages, total },
      status,
    } = await getUsers(category.value, sortBy.value, debouncedSearch.value, {
      page: currentPage,
      limit: USERS_PER_PAGE,
    });

    if (status === "success") {
      if (page === 1) {
        paginatedUsers.data = data;
      } else {
        paginatedUsers.data.push(...data);
      }
      paginatedUsers.page = page;
      paginatedUsers.totalPages = totalPages;
      paginatedUsers.totalResults = total;
    }
  } finally {
    isLoading.value = false;
    showUsersSkeletons.value = false;
  }
};

onBeforeMount(async () => {
  initialLoading.value = true;

  const [recentUsersRes] = await Promise.all([
    await getRecentUsers(),
    await fetchPaginatedUsers(currentPage.value),
  ]);

  if (recentUsersRes.status === "success") {
    recentUsers.value = recentUsersRes.data;
  }

  initialLoading.value = false;
});

watch([debouncedSearch, category, sortBy], async () => {
  currentPage.value = 1;
  await fetchPaginatedUsers(1);
});

watch(isNearBottom, async (nearBottom) => {
  if (
    nearBottom &&
    !isLoading.value &&
    !showUsersSkeletons.value &&
    currentPage.value < paginatedUsers.totalPages
  ) {
    currentPage.value++;
    await fetchPaginatedUsers(currentPage.value);
  }
});
</script>

<template>
  <div class="">
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
    <Carousel
      v-if="!(!initialLoading && !recentUsers.length)"
      class="flex flex-col gap-4 p-6 md:p-8 !pb-0 !pr-0 max-w-full overflow-hidden outline-none"
    >
      <div class="flex items-center justify-between pr-6 md:pr-8">
        <h3 class="text-xl sm:text-2xl font-semibold text-main-black">
          Recent Users
        </h3>
        <div class="flex gap-2.5 items-center">
          <CarouselPrevious
            :is-absolute="false"
            class="bg-transparent border-none shadow-none hover:bg-transparent cursor-pointer"
          >
            <ChevronLeft class="min-w-6 min-h-6" />
          </CarouselPrevious>
          <CarouselNext
            :is-absolute="false"
            class="bg-transparent border-none h-7 w-auto shadow-none hover:bg-transparent cursor-pointer"
          >
            <ChevronRight class="min-w-6 min-h-6" />
          </CarouselNext>
        </div>
      </div>
      <CarouselContent class="max-w-full grid-rows-1 h-full md:-ml-8">
        <template v-if="initialLoading">
          <CarouselItem
            v-for="_item in Array(8).fill(0)"
            class="md:basis-1/2 xl:basis-1/3 min-[1330px]:basis-[31%] md:pl-8"
          >
            <UserCardSkeleton />
          </CarouselItem>
        </template>
        <template v-else>
          <CarouselItem
            v-for="user in recentUsers"
            :key="`recent-${user.id}`"
            class="md:basis-1/2 xl:basis-1/3 min-[1330px]:basis-[31%] md:pl-8"
          >
            <UserCard :user="user" />
          </CarouselItem>
        </template>
      </CarouselContent>
    </Carousel>
    <div class="flex flex-col gap-4 p-6 md:p-8">
      <h3 class="text-xl sm:text-2xl font-semibold text-main-black">Users</h3>
      <div
        v-if="!isLoading && !paginatedUsers.data.length"
        class="text-lg text-main-purple-500 font-semibold flex-center py-6"
      >
        <h4>Oops! We couldn't find any users.</h4>
      </div>
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-6 2xl:gap-8"
      >
        <template v-if="isLoading">
          <UserCardSkeleton
            v-for="_item in Array(6).fill(0)"
            with-description
          />
        </template>
        <template v-else>
          <UserCard
            v-for="user in paginatedUsers.data"
            :user="user"
            :key="user.id"
            with-description
          />
          <UserCardSkeleton
            v-for="_item in Array(3).fill(0)"
            with-description
            v-if="showUsersSkeletons"
          />
        </template>
      </div>
    </div>
  </div>
</template>
