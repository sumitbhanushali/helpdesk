import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { init as initTelemetry } from "@/telemetry";

const routes = [
  {
    path: "",
    component: () => import("@/pages/HRoot.vue"),
  },
  {
    path: "/my-tickets",
    component: () => import("@/pages/CLayout.vue"),
    meta: {
      auth: true,
    },
    children: [
      {
        path: "",
        name: "TicketsCustomer",
        component: () => import("@/pages/TicketsCustomer.vue"),
      },
      {
        path: "new/:templateId?",
        name: "TicketNew",
        component: () => import("@/pages/TicketNew.vue"),
        props: true,
        meta: {
          onSuccessRoute: "TicketCustomer",
          parent: "TicketsCustomer",
        },
      },
      {
        path: ":ticketId",
        name: "TicketCustomer",
        component: () => import("@/pages/TicketCustomer.vue"),
        props: true,
      },
    ],
  },
  {
    path: "/knowledge-base",
    component: () => import("@/pages/KnowledgeBasePublic.vue"),
    children: [
      {
        path: "",
        name: "KBHome",
        component: () => import("@/pages/KnowledgeBasePublicHome.vue"),
      },
      {
        path: ":categoryId",
        name: "KBCategoryPublic",
        component: () => import("@/pages/KnowledgeBasePublicCategory.vue"),
        props: true,
      },
      {
        path: "articles/:articleId",
        name: "KBArticlePublic",
        component: () => import("@/pages/KnowledgeBaseArticle.vue"),
        meta: {
          public: true,
        },
        props: true,
      },
    ],
  },
  {
    path: "",
    meta: {
      auth: false,
    },
    children: [
      {
        path: "/login",
        name: "AuthLogin",
        component: () => import("@/pages/AuthLogin.vue"),
      },
      {
        path: "/signup",
        name: "AuthSignup",
        component: () => import("@/pages/AuthSignup.vue"),
      },
      {
        path: "/verify/:requestKey",
        name: "AuthVerify",
        component: () => import("@/pages/AuthVerify.vue"),
        props: true,
      },
    ],
  },
  {
    path: "/onboarding",
    name: "Setup",
    component: () => import("@/pages/SimpleOnboarding.vue"),
  },
  {
    path: "",
    name: "AgentRoot",
    component: () => import("@/pages/AgentRoot.vue"),
    meta: {
      auth: true,
      agent: true,
      admin: false,
    },
    children: [
      {
        path: "dashboard",
        name: "DeskDashboard",
        component: () => import("@/pages/DeskDashboard.vue"),
      },
      {
        path: "/tickets",
        name: "TicketsAgent",
        component: () => import("@/pages/TicketsAgent2.vue"),
      },
      {
        path: "/tickets/:ticketId",
        name: "TicketAgent",
        props: true,
        component: () => import("@/pages/TicketAgent.vue"),
      },
      {
        path: "/tickets/new/:templateId?",
        name: "TicketAgentNew",
        props: true,
        component: () => import("@/pages/TicketNew.vue"),
      },
      {
        path: "kb",
        name: "DeskKBHome",
        component: () => import("@/pages/KnowledgeBase.vue"),
        children: [
          {
            path: ":categoryId",
            name: "DeskKBCategory",
            props: true,
            component: () => import("@/pages/KnowledgeBaseCategory.vue"),
          },
          {
            path: ":categoryId/:subCategoryId",
            name: "DeskKBSubcategory",
            props: true,
            component: () => import("@/pages/KnowledgeBaseSubcategory.vue"),
          },
        ],
      },
      {
        path: "kb/articles/:articleId",
        name: "DeskKBArticle",
        props: true,
        component: () => import("@/pages/KnowledgeBaseArticle.vue"),
      },
      {
        path: "customers",
        name: "CustomerList",
        component: () => import("@/pages/CustomerList.vue"),
      },
      {
        path: "/contacts",
        name: "ContactList",
        component: () => import("@/pages/ContactList.vue"),
      },
      {
        path: "agents",
        name: "AgentList",
        component: () => import("@/pages/AgentList.vue"),
      },
      {
        path: "teams",
        name: "Teams",
        component: () => import("@/pages/TeamList.vue"),
      },
      {
        path: "teams/:teamId",
        name: "Team",
        component: () => import("@/pages/TeamSingle.vue"),
        props: true,
      },
      {
        path: "ticket-types",
        name: "TicketTypes",
        component: () => import("@/pages/TicketTypeList.vue"),
      },
      {
        path: "ticket-types/:id",
        name: "TicketType",
        component: () => import("@/pages/TicketType.vue"),
        props: true,
      },
      {
        path: "ticket-types/new",
        name: "NewTicketType",
        component: () => import("@/pages/TicketType.vue"),
      },
      {
        path: "canned-responses",
        name: "CannedResponses",
        component: () => import("@/pages/CannedResponseList.vue"),
      },
      {
        path: "canned-responses/:id",
        name: "CannedResponse",
        component: () => import("@/pages/CannedResponseSingle.vue"),
        props: true,
      },
      {
        path: "escalation-rules",
        name: "EscalationRules",
        component: () =>
          import("@/pages/EscalationRuleList.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory("/helpdesk/"),
  routes,
});

router.beforeEach(async (to) => {
  const isAuthRoute = ["AuthLogin", "AuthSignup", "AuthVerify"].includes(
    to.name
  );
  const authStore = useAuthStore();

  try {
    await initTelemetry();
    await authStore.init();

    if ((to.meta.agent && !authStore.hasDeskAccess) || isAuthRoute) {
      router.replace({ name: "Website Root" }); //TODO
    }
  } catch {
    if (!isAuthRoute) {
      router.replace({
        name: "AuthLogin",
        query: {
          redirect: to.path.toString(),
        },
      });
    }
  }
});
