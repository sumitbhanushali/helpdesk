<template>
  <div class="flex justify-between gap-3 border-t px-10 py-2.5">
    <div class="flex gap-1.5">
      <Button
        ref="sendEmailRef"
        variant="ghost"
        :class="[showEmailBox ? '!bg-gray-300 hover:!bg-gray-200' : '']"
        label="Reply"
        @click="toggleEmailBox()"
      >
        <template #prefix>
          <EmailIcon class="h-4" />
        </template>
      </Button>
      <Button
        variant="ghost"
        label="Comment"
        :class="[showCommentBox ? '!bg-gray-300 hover:!bg-gray-200' : '']"
        @click="toggleCommentBox()"
      >
        <template #prefix>
          <CommentIcon class="h-4" />
        </template>
      </Button>
    </div>
    <div v-if="showEmailBox" class="flex gap-1.5">
      <Button
        label="CC"
        :class="[newEmailEditor.cc ? 'bg-gray-300 hover:bg-gray-200' : '']"
        @click="toggleCC()"
      />
      <Button
        label="BCC"
        :class="[newEmailEditor.bcc ? 'bg-gray-300 hover:bg-gray-200' : '']"
        @click="toggleBCC()"
      />
    </div>
  </div>
  <div
    v-show="showEmailBox"
    @keydown.ctrl.enter.capture.stop="submitEmail"
    @keydown.meta.enter.capture.stop="submitEmail"
  >
    <EmailEditor
      ref="newEmailEditor"
      v-model:content="newEmail"
      v-model="doc.data"
      v-model:attachments="attachments"
      :submit-button-props="{
        variant: 'solid',
        onClick: submitEmail,
        disabled: emailEmpty,
      }"
      :discard-button-props="{
        onClick: () => {
          showEmailBox = false;
          newEmailEditor.subject = subject;
          newEmailEditor.toEmails = doc.data.email ? [doc.data.email] : [];
          newEmailEditor.ccEmails = [];
          newEmailEditor.bccEmails = [];
          newEmailEditor.cc = false;
          newEmailEditor.bcc = false;
          newEmail = '';
        },
      }"
      :editable="showEmailBox"
      :doctype="doctype"
      :subject="subject"
      placeholder="Add a reply..."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, defineModel } from "vue";
import { useStorage } from "@vueuse/core";
import { call } from "frappe-ui";
import CommentIcon from "@/components/icons/CommentIcon.vue";
import EmailIcon from "@/components/icons/EmailIcon.vue";

const emit = defineEmits(["scroll"]);

const props = defineProps({
  doctype: {
    type: String,
    default: "HD Ticket",
  },
});

const showEmailBox = ref(false);
const showCommentBox = ref(false);
const newEmailEditor = ref(null);
const attachments = ref([]);
const newEmail = useStorage("emailBoxContent", "");
const newComment = useStorage("commentBoxContent", "");
const doc = defineModel();
const reload = defineModel("reload");

function toggleCC() {
  newEmailEditor.value.cc = !newEmailEditor.value.cc;
  newEmailEditor.value.cc &&
    nextTick(() => {
      newEmailEditor.value.ccInput.setFocus();
    });
}

function toggleBCC() {
  newEmailEditor.value.bcc = !newEmailEditor.value.bcc;
  newEmailEditor.value.bcc &&
    nextTick(() => {
      newEmailEditor.value.bccInput.setFocus();
    });
}

function toggleEmailBox() {
  if (showCommentBox.value) {
    showCommentBox.value = false;
  }
  showEmailBox.value = !showEmailBox.value;
}

function toggleCommentBox() {
  if (showEmailBox.value) {
    showEmailBox.value = false;
  }
  showCommentBox.value = !showCommentBox.value;
}

async function sendMail() {
  let recipients = newEmailEditor.value.toEmails;
  let subject = newEmailEditor.value.subject;
  let cc = newEmailEditor.value.ccEmails || [];
  let bcc = newEmailEditor.value.bccEmails || [];
  await call("frappe.core.doctype.communication.email.make", {
    recipients: recipients.join(", "),
    attachments: attachments.value.map((x) => x.name),
    cc: cc.join(", "),
    bcc: bcc.join(", "),
    subject: subject,
    content: newEmail.value,
    doctype: props.doctype,
    name: doc.value.data.name,
    send_email: 1,
    sender: getUser().name,
    sender_full_name: getUser()?.full_name || undefined,
  });
}

async function submitEmail() {
  if (emailEmpty.value) return;
  showEmailBox.value = false;
  await sendMail();
  newEmail.value = "";
  reload.value = true;
  emit("scroll");
}
</script>
