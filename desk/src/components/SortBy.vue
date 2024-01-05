<template>
  <NestedPopover v-if="options">
    <template #target>
      <Button ref="sortButtonRef" label="Sort">
        <template #prefix><SortIcon class="h-4" /></template>
        <template v-if="sortValues.length" #suffix>
          <div
            class="text-2xs flex h-5 w-5 items-center justify-center rounded bg-gray-900 pt-[1px] font-medium text-white"
          >
            {{ sortValues.length }}
          </div>
        </template>
      </Button>
    </template>
    <template #body="{ close }">
      <div class="my-2 rounded-lg border border-gray-100 bg-white shadow-xl">
        <div class="min-w-[352px] p-2">
          <div
            v-if="sortValues.length"
            id="sort-list"
            class="mb-3 flex flex-col gap-2"
          >
            <div
              v-for="(sort, i) in sortValues"
              :key="sort.fieldname"
              class="flex items-center gap-2"
            >
              <div class="handle flex h-7 w-7 items-center justify-center">
                <DragIcon class="h-4 w-4 cursor-grab text-gray-600" />
              </div>
              <Autocomplete
                class="!w-32"
                :value="sort.fieldname"
                :options="sortOptions.data"
                placeholder="Sort by"
                @change="(e) => updateSort(e, i)"
              />
              <FormControl
                v-model="sort.direction"
                class="!w-32"
                type="select"
                :options="[
                  { label: 'Ascending', value: 'asc' },
                  { label: 'Descending', value: 'desc' },
                ]"
                placeholder="Sort by"
              />
              <Button variant="ghost" icon="x" @click="removeSort(i)" />
            </div>
          </div>
          <div
            v-else
            class="mb-3 flex h-7 items-center px-3 text-sm text-gray-600"
          >
            Empty - Choose a field to sort by
          </div>
          <div class="flex items-center justify-between gap-2">
            <Autocomplete
              :options="options"
              value=""
              placeholder="Sort by"
              @change="(e) => setSort(e)"
            >
              <template #target="{ togglePopover }">
                <Button
                  class="!text-gray-600"
                  variant="ghost"
                  label="Add Sort"
                  @click="togglePopover()"
                >
                  <template #prefix>
                    <FeatherIcon name="plus" class="h-4" />
                  </template>
                </Button>
              </template>
            </Autocomplete>
            <Button
              v-if="sortValues.length"
              class="!text-gray-600"
              variant="ghost"
              label="Clear Sort"
              @click="clearSort(close)"
            />
          </div>
        </div>
      </div>
    </template>
  </NestedPopover>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useSortable } from "@vueuse/integrations/useSortable";

import { useOrderBy } from "@/composables/orderby";
import NestedPopover from "@/components/NestedPopover.vue";
import SortIcon from "@/components/icons/SortIcon.vue";
import DragIcon from "@/components/icons/DragIcon.vue";

import {
  FeatherIcon,
  Button,
  Autocomplete,
  FormControl,
  createResource,
} from "frappe-ui";

const props = defineProps({
  doctype: {
    type: String,
    required: true,
  },
});

const sortOptions = createResource({
  url: "helpdesk.extends.doc.sort_options",
  auto: true,
  params: {
    doctype: props.doctype,
  },
});

const { get: getOrderBy, set: setOrderBy } = useOrderBy();
const sortValues = ref(initialOrderBy());

watch(
  () => sortValues.value,
  (value) => {
    const updatedSort = value
      .map((sort) => {
        const option = sortOptions.data.find((o) => o.value === sort.fieldname);
        return `${option.value} ${sort.direction}`;
      })
      .join(", ");
    setOrderBy(updatedSort);
  },
  {
    deep: true,
  }
);

watch(
  () => getOrderBy(),
  (value) => {
    if (!value) {
      sortValues.value = [];
    }
  }
);

function initialOrderBy() {
  const orderBy = getOrderBy();
  if (!orderBy) return [];
  const sortOptions = orderBy.split(", ");
  return sortOptions.map((sortOption) => {
    const [fieldname, direction] = sortOption.split(" ");
    return { fieldname, direction };
  });
}

const options = computed(() => {
  if (!sortOptions.data) return [];
  const selectedOptions = sortValues.value.map((sort) => sort.fieldname);
  return sortOptions.data.filter((option) => {
    return !selectedOptions.includes(option.value);
  });
});

const sortSortable = useSortable("#sort-list", sortValues, {
  handle: ".handle",
  animation: 200,
});

function setSort(data) {
  sortValues.value = [
    ...sortValues.value,
    { fieldname: data.value, direction: "asc" },
  ];
  sortSortable.start();
}

function updateSort(data, index) {
  sortValues.value[index] = {
    fieldname: data.value,
    direction: sortValues.value[index].direction,
  };
}

function removeSort(index) {
  sortValues.value.splice(index, 1);
}

function clearSort(close) {
  sortValues.value = [];
  close();
}
</script>
