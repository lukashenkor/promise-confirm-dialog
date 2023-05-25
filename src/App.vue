<template>
  <div>
    <button @click="openDialog">Open Dialog</button>
  </div>

  <!--@if "any dialogs are opened" -->
  <div v-if="hasDialogs" id="app-dialog-root" class="dialog-root">
    <!--@for each dialog:-->
    <div v-for="dialog in dialogs" class="wrapper" :key="dialog['id']">
      <component :is="dialog['component']" :dialog="dialog" :title="dialog['title']" />
      <!-- dialog component goes here -->
    </div>
    <!--@end for each dialog-->
  </div>
  <!--@end if "any dialogs are opened" -->
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, shallowRef } from "vue";
import { ConfirmDialog } from "./dialog/ConfirmDialog";
import { Dialog } from "./dialog/Dialog";

const dialogs = shallowRef<ConfirmUserDeleteDialog[]>([]);
const hasDialogs = ref(false);

class ConfirmUserDeleteDialog extends ConfirmDialog  {
  protected title = "Подтвердите удаление пользователя";
}

const openDialog = async () => {
  const dialog = new ConfirmUserDeleteDialog();
  const result = await dialog.open();
  console.log(result);
};


function openEventHandler (e: CustomEvent<Dialog>) {
  console.log('e', e);
  dialogs.value.push(e.detail as ConfirmUserDeleteDialog);
  hasDialogs.value = true;
}

function closeEventHandler (e: CustomEvent<Dialog>) {
  dialogs.value = dialogs.value.filter(dialog => dialog.id !== e.detail.id);
  if (!dialogs.value.length) {
    hasDialogs.value = false
  }
}

onBeforeMount(() => {
  document.addEventListener('open-event', (e) => openEventHandler(e as CustomEvent<Dialog>))
  document.addEventListener('close-event', (e) => closeEventHandler(e as CustomEvent<Dialog>))
})

onBeforeUnmount(() => {
  document.removeEventListener('open-event', (e) => openEventHandler(e as CustomEvent<Dialog>))
  document.removeEventListener('close-event', (e) => closeEventHandler(e as CustomEvent<Dialog>))
})

</script>
