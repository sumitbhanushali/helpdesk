<template>
  <Autocomplete
    placeholder="Select an option"
    :options="options"
    :value="selection"
    @update:query="(q: string) => onUpdateQuery(q)"
    @change="(val: object) => (selection = val)"
  />
</template>

<script setup lang="ts">
import { Autocomplete, createListResource } from "frappe-ui";
import { computed, ref } from "vue";

const props = defineProps({
  value: {
    type: String,
    required: false,
    default: "",
  },
  doctype: {
    type: String,
    required: true,
  },
  searchField: {
    type: String,
    required: false,
    default: "name",
  },
  labelField: {
    type: String,
    required: false,
    default: "name",
  },
  valueField: {
    type: String,
    required: false,
    default: "name",
  },
  pageLength: {
    type: Number,
    required: false,
    default: 10,
  },
});

const resource = createListResource({
  doctype: props.doctype,
  pageLength: props.pageLength,
  auto: true,
  fields: [props.labelField, props.searchField, props.valueField],
  filters: {
    [props.searchField]: ["like", `%${props.value}%`],
  },
  onSuccess: () => {
    selection.value = props.value
      ? options.value.find((option) => option.value === props.value)
      : null;
  },
});
const options = computed(
  () =>
  resource.data?.map((result) => ({
      label: result[props.labelField],
      value: result[props.valueField],
    })) || []
);
const selection = ref(null);

function onUpdateQuery(query: string) {
  resource.update({
    filters: {
      [props.searchField]: ["like", `%${query}%`],
    },
  });

  resource.reload();
}
</script>
