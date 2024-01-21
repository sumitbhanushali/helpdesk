<template>
  <NestedPopover>
    <template #target>
      <Button label="Filter">
        <template #prefix><FilterIcon class="h-4" /></template>
        <template v-if="storage.size" #suffix>
          <div
            class="text-2xs flex h-5 w-5 items-center justify-center rounded bg-gray-900 pt-[1px] font-medium text-white"
          >
            {{ storage.size }}
          </div>
        </template>
      </Button>
    </template>
    <template #body="{ close }">
      <div class="my-2 rounded bg-white shadow">
        <div class="min-w-[400px] p-2">
          <div v-if="storage.size">
            <div
              v-for="(filter, idx) in storage"
              id="filter-list"
              :key="idx"
              class="mb-3 flex items-center justify-between gap-2"
            >
              <div class="flex items-center gap-2">
                <div class="w-13 pl-2 text-end text-base text-gray-600">
                  {{ idx == 0 ? "Where" : "And" }}
                </div>
                <div id="fieldname" class="!min-w-[140px]">
                  <Autocomplete
                    :value="filter.field.fieldname"
                    :options="fields.data"
                    placeholder="Filter by..."
                    @change="(e) => updateFilter(e, idx)"
                  />
                </div>
                <div id="operator">
                  <FormControl
                    v-model="filter.operator"
                    type="select"
                    :options="getOperators(filter.field.fieldtype)"
                    placeholder="Operator"
                  />
                </div>
                <div id="value" class="!min-w-[140px]">
                  <SearchComplete
                    v-if="typeLink.includes(filter.field.fieldtype)"
                    :doctype="filter.field.options"
                    :value="filter.value.toString()"
                    placeholder="Value"
                    @change="(v) => (filter.value = v.value)"
                  />
                  <component
                    :is="getValSelect(filter.field.fieldtype, filter.field.options)"
                    v-else
                    v-model="filter.value"
                    placeholder="Value"
                  />
                </div>
              </div>
              <Button variant="ghost" icon="x" @click="removeFilter(idx)" />
            </div>
          </div>
          <div
            v-else
            class="mb-3 flex h-7 items-center px-3 text-sm text-gray-600"
          >
            Empty - Choose a field to filter by
          </div>
          <div class="flex items-center justify-between gap-2">
            <Autocomplete
              value=""
              :options="fields.data"
              placeholder="Filter by..."
              @change="(e) => setfilter(e)"
            >
              <template #target="{ togglePopover }">
                <Button
                  class="!text-gray-600"
                  variant="ghost"
                  label="Add filter"
                  @click="() => togglePopover()"
                >
                  <template #prefix>
                    <LucidePlus class="h-4 w-4" />
                  </template>
                </Button>
              </template>
            </Autocomplete>
            <Button
              v-if="storage.size"
              class="!text-gray-600"
              variant="ghost"
              label="Clear all filter"
              @click="() => clearfilter(close)"
            />
          </div>
        </div>
      </div>
    </template>
  </NestedPopover>
</template>
<script setup lang="ts">
import { h, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { Badge, Autocomplete, FormControl } from "frappe-ui";
import { useFilter } from "@/composables/filter";
import { NestedPopover, SearchComplete } from "@/components";
import FilterIcon from "@/components/icons/FilterIcon.vue";
import { DocField, Filter } from "@/types";

const props = defineProps({
  doctype: {
    type: String,
    required: true,
  },
});

const { apply, fields, storage } = useFilter(props.doctype);
const typeCheck = ["Check"];
const typeLink = ["Link"];
const typeNumber = ["Float", "Int"];
const typeSelect = ["Select"];
const typeString = ["Data", "Long Text", "Small Text", "Text Editor", "Text"];

watch(
  storage,
  useDebounceFn(() => apply(), 300),
  { deep: true }
);

function getOperators(fieldtype: string) {
  let options = [];
  if (typeString.includes(fieldtype)) {
    options.push(
      ...[
        { label: "Equals", value: "equals" },
        { label: "Not Equals", value: "not equals" },
        { label: "Like", value: "like" },
        { label: "Not Like", value: "not like" },
      ]
    );
  }
  if (typeNumber.includes(fieldtype)) {
    options.push(
      ...[
        { label: "<", value: "<" },
        { label: ">", value: ">" },
        { label: "<=", value: "<=" },
        { label: ">=", value: ">=" },
        { label: "Equals", value: "equals" },
        { label: "Not Equals", value: "not equals" },
      ]
    );
  }
  if (typeSelect.includes(fieldtype) || typeLink.includes(fieldtype)) {
    options.push(
      ...[
        { label: "Is", value: "is" },
        { label: "Is Not", value: "is not" },
      ]
    );
  }
  if (typeCheck.includes(fieldtype)) {
    options.push(...[{ label: "Equals", value: "equals" }]);
  }
  return options;
}

function getValSelect(fieldtype: string, options: string) {
  if (typeSelect.includes(fieldtype) || typeCheck.includes(fieldtype)) {
    const _options =
      fieldtype == "Check" ? ["Yes", "No"] : getSelectOptions(options);
    return h(FormControl, {
      type: "select",
      options: _options.map((o) => ({
        label: o,
        value: o,
      })),
    });
  } else {
    return h(FormControl, { type: "text" });
  }
}

function getDefaultValue(field: DocField) {
  if (typeSelect.includes(field.fieldtype)) {
    return getSelectOptions(field.options)[0];
  }
  if (typeCheck.includes(field.fieldtype)) {
    return "Yes";
  }
  return "";
}

function getDefaultOperator(fieldtype: string) {
  if (typeSelect.includes(fieldtype) || typeLink.includes(fieldtype)) {
    return "is";
  }
  if (typeCheck.includes(fieldtype) || typeNumber.includes(fieldtype)) {
    return "equals";
  }
  return "like";
}

function getSelectOptions(options: string) {
  return options.split("\n");
}

function setfilter(data) {
  storage.value.add({
    field: {
      fieldname: data.value,
      fieldtype: data.fieldtype,
      label: data.label,
      name: data.value,
      options: data.options,
    },
    fieldname: data.value, 
    operator: getDefaultOperator(data.fieldtype),
    label: data.label,
    value: getDefaultValue(data)
  });
}

function updateFilter(data, index: number) {
  storage.value.delete(Array.from(storage.value)[index]);
  storage.value.add({
    field: {
      fieldname: data.value,
      fieldtype: data.fieldtype,
      label: data.label,
      name: data.value,
      options: data.options,
    },
    fieldname: data.value, 
    operator: getDefaultOperator(data.fieldtype),
    label: data.label,
    value: getDefaultValue(data)
  });
}

function removeFilter(index: number) {
  storage.value.delete(Array.from(storage.value)[index]);
}

function clearfilter(close: Function) {
  storage.value.clear();
  close();
}
</script>
