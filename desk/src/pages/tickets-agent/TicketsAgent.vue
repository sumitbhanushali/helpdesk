<template>
  <div class="flex flex-col">
    <PageTitle title="Tickets">
      <template #right>
        <RouterLink :to="{ name: 'TicketAgentNew' }">
          <Button label="New ticket" theme="gray" variant="solid">
            <template #prefix>
              <LucidePlus class="h-4 w-4" />
            </template>
          </Button>
        </RouterLink>
      </template>
    </PageTitle>
    <div class="mx-5 mt-2.5 flex items-center justify-between">
      <PresetFilters doctype="HD Ticket" />
      <div class="flex items-center gap-2">
        <Filter doctype="HD Ticket" />
        <SortBy doctype="HD Ticket" />
        <ViewSettings v-model="tickets" doctype="HD Ticket" />
      </div>
    </div>
    <TicketsAgentList :resource="tickets" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { createResource, usePageMeta, Button, Dropdown } from "frappe-ui";

import { AGENT_PORTAL_TICKET } from "@/router";
import { socket } from "@/socket";

import { useAuthStore } from "@/stores/auth";

import { useFilter } from "@/composables/filter";
import { useOrderBy } from "@/composables/orderby";
import { createListManager } from "@/composables/listManager";

import {
  ColumnSelector,
  Filter,
  PageTitle,
  SortBy,
  ViewSettings,
} from "@/components";

import TicketsAgentList from "./components/TicketsAgentList.vue";
import PresetFilters from "./components/PresetFilters.vue";

const { userId } = useAuthStore();
const { getArgs } = useFilter("HD Ticket");
const { get: getOrderBy, set: setOrderBy } = useOrderBy();
const pageLength = ref(20);
const tickets = createListManager({
  doctype: "HD Ticket",
  pageLength: pageLength.value,
  filters: getArgs(),
  orderBy: getOrderBy(),
  auto: true,
  transform: (response) => {
    console.log(response, "dd");
    for (const d of response.data) {
      d.class = {
        "font-medium": !d._seen?.includes(userId),
      };
      d.onClick = {
        name: AGENT_PORTAL_TICKET,
        params: {
          ticketId: d.name,
        },
      };
      d.conversation = {
        incoming: d.count_msg_incoming,
        outgoing: d.count_msg_outgoing,
        comments: d.count_comment,
      };
      d.source = d.via_customer_portal ? "Customer portal" : "Email";
    }
    return response.data;
  },
});

function getParams() {
  const filters = getArgs() || {};
  const order_by = getOrderBy() || "modified desc";

  return {
    doctype: "HD Ticket",
    filters: filters,
    order_by: order_by,
  };
}

// const tickets = createResource({
//   url: 'helpdesk.api.doc.get_list_data',
//   params: getParams(),
//   auto: true,
// })

socket.on("helpdesk:new-ticket", () => {
  if (!tickets.hasPreviousPage) tickets.reload();
});

const columns = [
  {
    label: "#",
    key: "name",
    width: "w-10",
    text: "text-sm",
  },
  {
    label: "Subject",
    key: "subject",
    width: "w-96",
    text: "text-gray-900",
  },
  {
    label: "Status",
    key: "status",
    width: "w-20",
  },
  {
    label: "Priority",
    key: "priority",
    width: "w-32",
  },
  {
    label: "Type",
    key: "ticket_type",
    width: "w-36",
  },
  {
    label: "Team",
    key: "agent_group",
    width: "w-36",
  },
  {
    label: "Contact",
    key: "contact",
    width: "w-36",
  },
  {
    label: "Agreement status",
    key: "agreement_status",
    width: "w-36",
  },
  {
    label: "First response",
    key: "response_by",
    width: "w-32",
  },
  {
    label: "Resolution",
    key: "resolution_by",
    width: "w-32",
  },
  {
    label: "Customer",
    key: "customer",
    width: "w-36",
  },
  {
    label: "Source",
    key: "source",
    width: "w-36",
  },
  {
    label: "Assignee",
    key: "assignee",
    width: "w-40",
  },
  {
    label: "Conversation",
    key: "conversation",
    width: "w-28",
  },
  {
    label: "Last modified",
    key: "modified",
    width: "w-32",
  },
  {
    label: "Created",
    key: "creation",
    width: "w-36",
  },
];

usePageMeta(() => {
  return {
    title: "Tickets",
  };
});
</script>
