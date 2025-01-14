<!-- Display avaliable consent signing methods in country -->
<template>
    <div class="column is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
      <h1 class="title is-5">Consent signing Methods</h1>
  
      <div class="is-flex is-flex-direction-row is-align-items-center is-justify-content-center">
        <div  v-for="method in consentStore.avaliableMethods.value" :key="method.authenticationMethodId" class="has-text-centered px-3">
          <button class="button is-grey" @click="method.redirectAuth ? redirectConsent() : goDecoupledConesntSign(), consentStore.chosenMethod = method">
            {{ method.authenticationType }}
          </button>
        </div>
      </div>

      <button class="button is-light mt-4" @click="cancleConsentSigning()">Cancel</button>

    </div>
</template>

<script setup>
import {  onMounted } from 'vue';
import { defineProps } from 'vue';
import Cookies from 'js-cookie'
import { useToast } from "vue-toastification";

import useHelperStore from '../stores/helper'
import useConsentStore from '../stores/consent'

const helperStore = useHelperStore()
const consentStore = useConsentStore()

const toast = useToast()

const props = defineProps({
  account: {
    type: Object,
  },
  accountId: {
    type: String,
  },
  accountIBAN: {
    type: String,
  },
});

const iban = props?.account?.iban || props.accountIBAN
const accountId = props?.account?.resourceId || props.accountId

const goDecoupledConesntSign = () => {
    helperStore.viewConsentMethods = false;
    helperStore.viewConsentData = true;
}

// Asign which are decoupled and which are redirect signing methods
const filterSigningMethods = (methods) => {
  return methods
    .filter(method => method.authenticationType !== "Biometrics") 
    .map(method => {
      if (["EPARAKSTS_MOBILE", "MOBILE_ID"].includes(method.authenticationMethodId)) {
        method.decoupledAuth = true; 
      } else {
        method.redirectAuth = true;
      }
      return method;
    });
};

const cancleConsentSigning = () => {
  helperStore.viewConesntInfo = true;
  helperStore.viewConsentMethods = false;
  helperStore.viewConsentData = false;
  helperStore.viewConsentSign = false;
  helperStore.expandedRows = {};
}

// Start redirect consent signing
const redirectConsent = async () => {
  try {
    const token = Cookies.get('token')

    const access = {
      accounts: [{ iban: iban }],
      balances: [{ iban: iban }],
      transactions: [{ iban: iban }],
    }

    const consent = await consentStore.createConsent(token, access, accountId)

    Cookies.set('token', consent.token); 

    return window.location.href = consent._links.scaRedirect.href;
  } catch (error) {
    toast.error(error?.response?.data[0].text || 'An error occurred')
  }
}

// Get consent signing methods
const decopoledConesnt = async (iban, accountId) => {
  try {
    const token = Cookies.get('token')

    const access = {
      accounts: [{ iban: iban }],
      balances: [{ iban: iban }],
      transactions: [{ iban: iban }],
    }

    const consentData = await consentStore.decoupledConsent(token, access, accountId)

    consentStore.avaliableMethods.value = consentData.scaMethods
    consentStore.authorisationId.value = consentData.authorisationId

    filterSigningMethods(consentStore.avaliableMethods.value)
    
    Cookies.set('token', consentData.token); 

    return;
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data[0].text || error.message)
  }
}

onMounted(async () => {
    await decopoledConesnt(iban, accountId);
})

</script>