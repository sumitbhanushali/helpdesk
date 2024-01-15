<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const router = useRouter();
const authStore = useAuthStore();
const configStore = useConfigStore();

function getTarget() {
  if (authStore.hasDeskAccess) return 'TicketsAgent';
  else if (configStore.preferKnowledgeBase) return 'KBHome';
  else return 'TicketsCustomer';
}

router.push({ name: getTarget() });
</script>
