<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import { Select } from "@/components/ui/select";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import Input from "@/components/ui/input/Input.vue";
import FilterSidebar from "./FilterSidebar.vue";

import {
  LayoutTemplate,
  ListFilter,
  Search,
  SlidersHorizontal,
} from "lucide-vue-next";

import { FilterOption, JobRolesEnum } from "@/interfaces";
import { UserSortType } from "@/interfaces/users";

interface FilterProps {
  sortOptions: FilterOption<UserSortType>[];
  categories: FilterOption<JobRolesEnum>[];
  category: JobRolesEnum | undefined;
  placeholder: string;
  sidebarTitle: string;
  isLoading: boolean;
  sortBy: string;
  search: string;
}

withDefaults(defineProps<FilterProps>(), {
  placeholder: "Search",
});

const emit = defineEmits<{
  (event: "category-change", category: string | undefined): void;
  (event: "sort-update", sortOption: string): void;
  (event: "search-input", input: string): void;
}>();

const isSidebarOpen = ref<boolean>(false);

const handleSidebarClose = (e: KeyboardEvent) => {
  if (e.key === "Escape") isSidebarOpen.value = false;
};

onMounted(() => document.addEventListener("keydown", handleSidebarClose));

onUnmounted(() => document.removeEventListener("keydown", handleSidebarClose));
</script>

<template>
  <div
    class="px-6 md:px-8 pb-8 bg-white relative flex items-center justify-between gap-6"
  >
    <div class="absolute w-px h-full top-0 bottom-0 -left-px bg-white" />
    <div class="relative w-full min-[876px]:max-w-[480px] flex-1">
      <Input
        class="border-[#F5F5F7] placeholder:text-[#54577A] placeholder:text-sm pr-12 text-sm h-[52px] rounded-lg-max"
        @update:model-value="(e) => emit('search-input', e as string)"
        :placeholder="placeholder"
        :value="search"
        type="text"
      />
      <Search
        class="absolute right-6 top-1/2 -translate-y-1/2 size-5 text-[#8E92BC]"
      />
    </div>

    <div>
      <div
        class="hidden min-[876px]:flex justify-between min-[876px]:justify-stretch w-full items-center gap-6"
      >
        <Select @update:model-value="(value) => emit('category-change', value)">
          <SelectTrigger
            class="w-min flex items-center gap-3 border border-[#F5F5F7] px-7 py-3.5 rounded-lg-max h-[52px]"
            :with-icon="false"
          >
            <LayoutTemplate class="text-[#8E92BC] size-[22px] -rotate-90" />
            <span class="text-main-black text-xs font-semibold">
              {{
                categories.find((item) => item.value === category)?.label ??
                "Category"
              }}
            </span>
          </SelectTrigger>
          <SelectContent class="max-h-[225px]">
            <SelectItem
              v-for="category in categories"
              class="pl-2.5"
              :key="category.value"
              :value="category.value"
              :with-icon="false"
            >
              {{ category.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          @update:model-value="(value) => emit('sort-update', value)"
          :default-value="sortOptions[0].value"
        >
          <SelectTrigger
            class="flex items-center gap-3 border border-[#F5F5F7] px-7 py-3.5 rounded-lg-max h-[52px]"
            :with-icon="false"
          >
            <ListFilter class="text-[#8E92BC] size-[22px]" />
            <div class="flex items-center gap-1">
              <strong class="text-xs font-semibold">
                Sort By:
                {{ sortOptions.find((item) => item.value === sortBy)?.label }}
              </strong>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              class="pl-2.5"
              v-for="option in sortOptions"
              :value="option.value"
              :key="option.value"
              :with-icon="false"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        @click="isSidebarOpen = true"
        class="flex min-[876px]:hidden items-center gap-3 border border-[#F5F5F7] p-3.5 rounded-lg-max h-[52px]"
      >
        <SlidersHorizontal class="text-[#8E92BC] size-[22px]" />
      </button>
    </div>
  </div>

  <FilterSidebar
    :sidebar-title="sidebarTitle"
    :is-open="isSidebarOpen"
    @on-close="(value) => (isSidebarOpen = value)"
  >
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-3">
        <label class="text-sm font-medium">Category</label>
        <Select @update:model-value="(value) => emit('category-change', value)">
          <SelectTrigger
            id="select"
            class="w-full flex items-center justify-start gap-3 border border-[#F5F5F7] px-4 py-3.5 rounded-lg-max h-[52px]"
            :with-icon="false"
          >
            <LayoutTemplate class="text-[#8E92BC] size-[22px] -rotate-90" />
            <span class="text-main-black text-xs font-semibold">
              {{
                categories.find((item) => item.value === category)?.label ??
                "Category"
              }}
            </span>
          </SelectTrigger>
          <SelectContent class="max-h-[225px]">
            <SelectItem
              v-for="category in categories"
              class="pl-2.5"
              :key="category.value"
              :value="category.value"
              :with-icon="false"
            >
              {{ category.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex flex-col gap-3">
        <label class="text-sm font-medium">Sort By</label>
        <Select
          @update:model-value="(value) => emit('sort-update', value)"
          :default-value="sortOptions[0].value"
        >
          <SelectTrigger
            class="flex items-center justify-start gap-3 border border-[#F5F5F7] px-4 py-3.5 rounded-lg-max h-[52px]"
            :with-icon="false"
          >
            <ListFilter class="text-[#8E92BC] size-[22px]" />
            <div class="flex items-center gap-1">
              <strong class="text-xs font-semibold">
                Sort By:
                {{ sortOptions.find((item) => item.value === sortBy)?.label }}
              </strong>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              class="pl-2.5"
              v-for="option in sortOptions"
              :value="option.value"
              :key="option.value"
              :with-icon="false"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </FilterSidebar>
</template>
