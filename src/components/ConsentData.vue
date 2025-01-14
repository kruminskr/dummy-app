<!-- Redirect consent signing -->
<!-- Input user information, for conesnt signing -->
<template>
    <div class="column is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
        <h1 class="title is-5">{{ consentStore.chosenMethod.authenticationType }}</h1>

        <div v-if="consentStore.chosenMethod" class="mt-4">
        <div class="field">
          <div class="control">
            <input v-model="userId" class="input" type="text" placeholder="User ID"/>
          </div>
        </div>
  
        <div class="field" v-if="consentStore.chosenMethod.authenticationMethodId === 'EPARAKSTS_MOBILE'">
          <div class="control">
            <input v-model="personalCode" class="input" type="text" placeholder="Personal Code" />
          </div>
        </div>
  
        <div class="field" v-if="consentStore.chosenMethod.authenticationMethodId === 'MOBILE_ID'">
          <div class="control is-flex is-align-items-center">
            <select v-model="selectedCountry" class="input country">
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.name }}
              </option>
            </select>
  
            <input v-model="phoneNumber" class="input phone" type="text" placeholder="Phone number"/>
          </div>
        </div>
  
        <div class="field mt-4 is-pulled-right">
          <div class="control">
            <button class="button mr-4" @click="cancleConsentSign(accountId)">Cancle</button>
            <button class="button is-light" @click="submitForm()">Consent</button>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref } from 'vue';
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

const userId = ref('')
const personalCode = ref('')
const phoneNumber = ref('')
const selectedCountry = ref('');

const countries = [
  { name: 'LV +371', code: '+371' },
  { name: 'LT +370', code: '+370' },
  { name: 'EE +372', code: '+372' },
];

const goLoadingScreen = () => {
  helperStore.viewConsentData = false;
  helperStore.viewConsentSign = true;
}

const cancleConsentSign = (accountId) => {
  helperStore.toggleDropdown(accountId)
  helperStore.viewConsentData = false;
  helperStore.viewConesntInfo = true;
}

// Starts consent signing process
const startSCA = async (userId, personalCode, phoneNumber) => {
  try {
    const token = Cookies.get('token')

    const psuData = {
        [personalCode ? 'personalCode' : 'phoneNumber']: personalCode || phoneNumber
    }

    const scaData = await consentStore.startSCA(token, psuData, accountId)

    consentStore.scaData = scaData;

    goLoadingScreen()

    return;
  } catch (error) {
    toast.error(error?.response?.data[0].text || error.response.data)
  }
}

// Check if all input fields are filled and correct
const submitForm = async () => {
  if (!userId.value || (!personalCode.value && !phoneNumber.value)) {
    toast.warning('Please enter all values.');
    return;
  }

    const userIdRegex = /^\d{6,8}$/;
    if (!userIdRegex.test(userId.value)) {
        toast.warning('User ID must be between 6 and 8 digits.');
        return;
    }

    if (consentStore.chosenMethod.authenticationMethodId ==='EPARAKSTS_MOBILE') {
      const personalCodeRegex = /^\d{6}-\d{5}$/;
      if (!personalCodeRegex.test(personalCode.value)) {
          toast.warning('Personal Code must be in the format 123456-12345.');
          return;
      }

      await startSCA(userId.value, personalCode.value, null);
      return;
    }

    if (consentStore.chosenMethod.authenticationMethodId === 'MOBILE_ID') {
      const phoneNumberRegex = /^\d{8}$/;
      if (!phoneNumberRegex.test(phoneNumber.value)) {
        toast.warning('Phone number must be 8 digits long.');
        return;
      }

      if (!selectedCountry.value) {
        toast.warning('Select a country.');
        return;
      }

      const fullPhoneNumber = selectedCountry.value + phoneNumber.value;

      await startSCA(userId.value, null, fullPhoneNumber);
    }
};
</script>

<style scoped>
.input {
    width: 300px;
}

.country {
  width: 80px;
  margin-right: 10px
}

.phone {
  width: calc(100% - 90px);
}
</style>