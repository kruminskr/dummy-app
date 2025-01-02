<template>
    <div>
        <!-- Explanation Section -->
        <h2 class="title is-5">Consent Options for Account: {{ account.name }}</h2>

        <ul class="content">
            <li>
            <strong>Account, Balances, and Transactions Access:</strong> Allows access to the account's basic details, balance, and transactions within the last 90 days.
            </li>
        </ul>

        <!-- Consent Options -->
        <div class="field">
            <label class="checkbox">
            <input type="checkbox" v-model="consentOptions.account"/>
                Access account, balance, and transaction
            </label>
        </div>

        <!-- Actions -->
        <button class="button mt-3 mr-2" @click="helperStore.toggleDropdown(account.resourceId)">Cancel</button>
        <button class="button is-light mt-3" @click="goConsentMethods()" :disabled="!hasSelectedConsentOptions">Continue</button>

        <!-- <button class="button is-light mt-3" @click="redirectConsent(account)" :disabled="!hasSelectedConsentOptions">Confirm Consent</button> -->
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { defineProps } from 'vue';

import useHelperStore from '../stores/helper'

const helperStore = useHelperStore()

defineProps({
  account: {
    type: Object,
    required: true,
  },
});

const hasSelectedConsentOptions = computed(() => {
  const basicSelected = consentOptions.value.account;

  return basicSelected
});

const consentOptions = ref({
    account: false,
});

const goConsentMethods = () => {
    helperStore.viewConesntInfo = false;
    helperStore.viewConsentMethods = true;
}

// const redirectConsent = async (account) => {
//   try {
//     const token = Cookies.get('token')

//     console.log('account', account)

//     const access = {};
//     if (consentOptions.value.account) {
//       access.accounts = [{ iban: account.iban }];
//       access.balances = [{ iban: account.iban }];
//       access.transactions = [{ iban: account.iban }];
//     }
//     if (consentOptions.value.transactionsOver90Days) {
//       access.transactionsOver90Days = [{ iban: account.iban }];
//     }

//     if (Object.keys(access).length === 0) {
//       toast.warning('No consent options selected')
//       return;
//     }

//     const consent = await consentStore.createConsent(token, access, account.resourceId)

//     Cookies.set('token', consent.token); 

//     return window.location.href = consent._links.scaRedirect.href;
//   } catch (error) {
//     toast.error(error.response.data[0].text || 'An error occurred')
//   }
// }
</script>

