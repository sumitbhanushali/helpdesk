import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { init as initTelemetry } from "@/telemetry";

export const LOGIN = "AuthLogin";
export const SIGNUP = "AuthSignup";
export const VERIFY = "AuthVerify";
export const AUTH_ROUTES = [LOGIN, SIGNUP, VERIFY];

export const WEBSITE_ROOT = "Website Root";

const routes = [
  {
    path: "",
    component: () => import("@/pages/HRoot.vue"),
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
    path: "/tickets",
    name: "TicketsAgent",
    component: () => import("@/pages/TicketsAgent.vue"),
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
];

export const router = createRouter({
  history: createWebHistory("/helpdesk/"),
  routes,
});

router.beforeEach(async (to) => {
  const isAuthRoute = AUTH_ROUTES.includes(to.name);
  const authStore = useAuthStore();

  try {
    await initTelemetry();
    await authStore.init();

    if ((to.meta.agent && !authStore.hasDeskAccess) || isAuthRoute) {
      router.replace({ name: WEBSITE_ROOT });
    }
  } catch {
    if (!isAuthRoute) {
      router.replace({
        name: LOGIN,
        query: {
          redirect: to.path.toString(),
        },
      });
    }
  }
});
