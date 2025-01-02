<template>
    <div class="container is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
      <div class="has-text-centered">
        <h1 class="title is-4">{{ consentStore.scaData.chosenScaMethod.authenticationType }}</h1>
        
        <!-- Display SCA Status -->
        <div v-if="consentStore.scaData.scaStatus" class="content">
          <p><strong>Status:</strong> {{ consentStore.scaData.scaStatus }}</p>
        </div>
    
        <!-- Display Challenge Data -->
        <div v-if="consentStore.scaData.challengeData" class="content">
          <p><strong>Challenge Code:</strong> {{ consentStore.scaData.challengeData.code }}</p>
        </div>
    
        <!-- Display PSU Message -->
        <div v-if="consentStore.scaData.psuMessage" class="content">
          <p>{{ consentStore.scaData.psuMessage }}</p>
        </div>

      </div>
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
});

const accountId = props?.account?.resourceId || props.accountId

const goToAccount = () => {
  helperStore.viewConesntInfo = true;
  helperStore.viewConsentMethods = false;
  helperStore.viewConsentData = false;
  helperStore.viewConsentSign = false;
  helperStore.expandedRows = {};

  window.location.href = `/account/${accountId}/balance`;

  return;
}

const checkScaStatus = async () => {
  try {
    const token = Cookies.get('token')

    await consentStore.checkScaStatus(token, accountId)

    goToAccount()

    return;
  } catch (error) {
    toast.error(error?.response?.data[0].text || error.message)
  }
}

onMounted(() => {
  checkScaStatus()
})
</script>