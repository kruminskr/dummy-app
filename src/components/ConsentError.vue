<template>
  <div  class="modal is-active">
    <div class="modal-background"></div>
    <div v-if="helperStore.viewConesntInfo" class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Consent limit reached</p>
      </header>
      <section class="modal-card-body">
        <p>{{ message }}</p>
      </section>
      <footer class="modal-card-foot">
        <button class="button mr-3" @click="redirectAccounts()">Go to Accounts</button>
        <button class="button is-light" @click="goConsentMethods()">Resign Consent</button>
      </footer>
    </div>

    <div v-if="helperStore.viewConsentMethods" class="modal-card">
      <header class="modal-card-head"></header>
      <section class="modal-card-body">
        <ConsentMethods  :accountIBAN="accountIBAN" :accountId="accountId" />
      </section>
      <footer class="modal-card-foot">
      </footer>
    </div>

    <div v-if="helperStore.viewConsentData" class="modal-card">
      <header class="modal-card-head"></header>
      <section class="modal-card-body">
        <ConsentData  :accountId="accountId" />
      </section>
      <footer class="modal-card-foot">
      </footer>
    </div>

    <div v-if="helperStore.viewConsentSign" class="modal-card">
      <header class="modal-card-head"></header>
      <section class="modal-card-body">
        <ConsentSign :accountId="accountId" />
      </section>
      <footer class="modal-card-foot">
      </footer>
    </div>

  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router';
import { defineProps } from 'vue';

import ConsentMethods from './ConsentMethods.vue';
import ConsentData from './ConsentData.vue';
import ConsentSign from './ConsentSign.vue';

import useHelperStore from '../stores/helper';

const router = useRouter();
const route = useRoute();

const helperStore = useHelperStore();


const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  accountIBAN: { 
    type: String,
    required: true, 
  },
});

const goConsentMethods = () => {
    helperStore.viewConesntInfo = false;
    helperStore.viewConsentMethods = true;
}

const redirectAccounts = () => {
  router.push('/account'); 
};

const extractIban = (text) => {
  const ibanRegex = /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/;
  const match = text.match(ibanRegex);
  return match ? match[0] : null; 
};

const accountId = route.params.id
const accountIBAN = extractIban(props.message)
</script>
  