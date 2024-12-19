<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Consent limit reached</p>
      </header>
      <section class="modal-card-body">
        <p>{{ message }}</p>
      </section>
      <footer class="modal-card-foot">
        <button class="button mr-3" @click="redirectAccounts()">Go to Accounts</button>
        <button class="button is-light" @click="createDetailedConsent()">Resign Consent</button>
      </footer>
    </div>
  </div>
</template>


<script setup>
import { useRouter, useRoute } from 'vue-router';
import { defineProps } from 'vue';
import Cookies from 'js-cookie';
import { useToast } from 'vue-toastification';

import useConsentStore from '../stores/consent';

const router = useRouter();
const route = useRoute();

const consentStore = useConsentStore();

const toast = useToast();

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

const redirectAccounts = () => {
  router.push('/account'); 
};

const extractIban = (text) => {
  const ibanRegex = /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/;
  const match = text.match(ibanRegex);
  return match ? match[0] : null; 
};

const createDetailedConsent = async () => {
  try {
    const token = Cookies.get('token')
    const accountId = route.params.id

    const accountIBAN = extractIban(props.message)

    const access = {
      accounts: [
      {
        iban: accountIBAN
      }
      ],
      balances: [
        {
          iban: accountIBAN
        }
      ],
      transactions: [
        {
          iban: accountIBAN
        }
      ]
    };

    const consent = await consentStore.createConsent(token, access, accountId)

    Cookies.set('token', consent.token); 

    return window.location.href = consent._links.scaRedirect.href;
  } catch (error) {
    toast.error(error?.response?.data[0].text || error)
  }
}
</script>
  
<style scoped>

</style>
  