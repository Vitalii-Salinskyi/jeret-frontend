<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { useSessionStore } from "@/stores/sessionStore";
import { useToast } from "@/components/ui/toast";

import AuthInput from "@/components/shared/auth/AuthInput.vue";
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

import { createProject, updateProjectName } from "@/api/projects";

import {
  CreateProjectDto,
  IProject,
  UpdateProjectDto,
} from "@/interfaces/projects";

interface CreateOrUpdateProjectModalProps {
  type: "update" | "create" | null;
  project: IProject | null;
}

const props = defineProps<CreateOrUpdateProjectModalProps>();

const emit = defineEmits<{
  (event: "project-create", project: IProject): void;
  (event: "project-update", project: IProject, name: string): void;
  (event: "close", val: boolean): void;
}>();

const sessionStore = useSessionStore();
const { toast } = useToast();

const name = ref("");
const isLoading = ref<boolean>(false);

const isValidName = computed(() => name.value.trim().length > 0);

const handleDialogUpdate = (val: boolean) => {
  emit("close", val);

  if (!val) {
    name.value = "";
  }
};

const createNewProject = async () => {
  if (!sessionStore.user?.id || !isValidName.value) return;

  isLoading.value = true;

  const dto: CreateProjectDto = {
    owner_id: sessionStore.user?.id,
    name: name.value.trim(),
  };

  try {
    const res = await createProject(dto);

    if (res.status === "failure") {
      toast({
        title: "Failed to create the project",
        description: res.data as unknown as string,
        variant: "destructive",
      });
      return;
    }

    emit("project-create", res.data);

    emit("close", false);
  } finally {
    isLoading.value = false;
  }
};

const editName = async () => {
  if (!props.project || !isValidName.value || name.value === props.project.name)
    return;

  isLoading.value = true;

  const dto: UpdateProjectDto = {
    project_id: props.project?.id,
    name: name.value.trim(),
  };

  try {
    const res = await updateProjectName(dto);

    if (res.status === "failure") {
      toast({
        title: "Failed to update the project",
        description: res.data as unknown as string,
        variant: "destructive",
      });
      return;
    }

    emit("project-update", props.project, name.value);

    emit("close", false);
  } finally {
    isLoading.value = false;
  }
};

watch([() => props.type, () => props.project], ([newType, newProject]) => {
  if (newType === "create") {
    name.value = "";
  } else if (newType === "update" && newProject?.name) {
    name.value = props.project?.name as string;
  }
});
</script>

<template>
  <Dialog :open="type !== null" @update:open="handleDialogUpdate">
    <slot />
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ type === "create" ? "Create project" : "Update project" }}
        </DialogTitle>
        <DialogDescription>
          {{
            type === "update"
              ? `Please enter the new name of the project: ${project?.name}`
              : "Please enter the name of the new project"
          }}
        </DialogDescription>
      </DialogHeader>

      <form
        id="projectForm"
        @submit.prevent="
          () => (type === 'create' ? createNewProject() : editName())
        "
      >
        <AuthInput
          v-model="name"
          id="project-name-input"
          label="Name"
          placeholder="My new project"
        />
      </form>
      <DialogFooter>
        <Button
          class="relative w-20"
          type="submit"
          form="projectForm"
          :disabled="!isValidName"
        >
          <Spinner v-if="isLoading" />
          <template v-else>
            {{ type === "create" ? "Create" : "Update" }}
          </template>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
