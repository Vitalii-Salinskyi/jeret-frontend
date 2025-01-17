<script setup lang="ts">
import { computed, ref } from "vue";

import { useToast } from "@/components/ui/toast";

import Spinner from "@/components/ui/Spinner.vue";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { bulkDeleteProjects } from "@/api/projects";

interface RemoveProjectConfirmModalProps {
  projectsIds: number[];
  isOpen: boolean;
}

const props = defineProps<RemoveProjectConfirmModalProps>();

const emit = defineEmits<{
  (event: "update:open", val: boolean, isDeleted?: boolean): void;
}>();

const { toast } = useToast();

const isLoading = ref<boolean>(false);

const countText = computed(() => (props.projectsIds.length > 1 ? "s" : ""));

const handleDialogUpdate = (val: boolean) => {
  emit("update:open", val);
};

const deleteProjects = async () => {
  isLoading.value = true;

  try {
    if (!props.projectsIds.length) {
      emit("update:open", false);
      return;
    }

    const res = await bulkDeleteProjects(props.projectsIds);

    if (res.status === "failure") {
      toast({
        title: `Failed to delete project${countText}`,
        description: res.data as unknown as string,
        variant: "destructive",
      });
      return;
    }

    emit("update:open", false, true);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <template>
    <Dialog :open="isOpen" @update:open="handleDialogUpdate">
      <slot />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {{
              projectsIds.length
                ? `Delete ${projectsIds.length} project${countText}?`
                : "No owned projects selected"
            }}
          </DialogTitle>
          <DialogDescription>
            <span class="text-red-500">
              Only the selected projects that you owe will be permanently
              deleted.
            </span>
            {{
              projectsIds.length
                ? "Careful, this action cannot be undone."
                : "Please select one or more projects you owe to delete."
            }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            class="relative px-5 w-max bg-red-500/80 hover:bg-red-500 min-w-20 transition-all scale-click"
            type="submit"
            form="projectForm"
            :disabled="isLoading"
            @click="deleteProjects"
          >
            <Spinner v-if="isLoading" />
            <template v-else>
              {{
                projectsIds.length
                  ? `Delete ${projectsIds.length} project${countText}`
                  : "Close"
              }}
            </template>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </template>
</template>
