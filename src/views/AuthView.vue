<template>
<div class="columns is-gapless">
    <!-- Left Side -->
    <div class="column is-half is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
      <h1 class="title is-2">{{ store.method.authenticationType }}  authentication</h1>
      
      <div class="">
        <div class="field">
          <div class="control">
            <input v-model="userId" class="input" type="text" placeholder="User ID" />
          </div>
        </div>

         <div class="field">
          <div v-if="store.method.authenticationMethodId === 'EPARAKSTS_MOBILE'" class="control">
            <input v-model="personalCode" class="input" type="text" placeholder="Personal Code" />
          </div>

          <div v-if="store.method.authenticationMethodId === 'MOBILE_ID'" class="control is-flex is-align-items-center">
            <select v-model="selectedCountry" class="input country">
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.name }}
              </option>
            </select>

            <input v-model="phoneNumber" class="input phone" type="text" placeholder="Phone number"/>
          </div>
        </div>
        
        <div class="field is-pulled-right">
          <div class="control is-flex">
            <button @click="redirectStart()" class="button is-light mr-3">Back</button>

            <button @click="submitForm()" class="button">Submit</button>
          </div>
        </div>

      </div>
    </div>

    <!-- Right Side -->
    <div class="column is-half">
      <img src="../assets/img/login-bg.jpg" alt="Login Background" class="image is-fullwidth is-fullheight"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import { useRouter  } from 'vue-router'

import axios from 'axios';
import Cookies from 'js-cookie'

import useAuthStore from '../stores/auth';

const store = useAuthStore()

const router = useRouter();
const toast = useToast()

const userId = ref('');
const personalCode = ref('');
const phoneNumber = ref('');
const selectedCountry = ref('');

const redirectStart = () => {
  router.push('/')
}

const countries = [
  { name: 'LV +371', code: '+371' },
  { name: 'LT +370', code: '+370' },
  { name: 'EE +372', code: '+372' },
];

const decoupledAuth = async (userId, personalCode, phoneNumber) => {
  try {
    const body = {
        authMethod: store.method.authenticationMethodId,
        userId,
        [personalCode ? 'personalCode' : 'phoneNumber']: personalCode || phoneNumber
    }

    const { data } = await axios.post('http://localhost:3000/api/app/auth/decoupled', body)

    Cookies.set('token', data); 

    router.push('/account')

    return;
  } catch (error) {
    toast.error(error.response.data[0].text || 'An error occurred')
    return;
  }
}

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

    if (store.method.authenticationMethodId ==='EPARAKSTS_MOBILE') {
      const personalCodeRegex = /^\d{6}-\d{5}$/;
      if (!personalCodeRegex.test(personalCode.value)) {
          toast.warning('Personal Code must be in the format 123456-12345.');
          return;
      }

      await decoupledAuth(userId.value, personalCode.value, null);
      return;
    }

    if (store.method.authenticationMethodId === 'MOBILE_ID') {
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

      await decoupledAuth(userId.value, null, fullPhoneNumber);
    }
};
</script>

<style scoped>
.image {
  object-fit: cover;
  height: 100%;
}

.columns {
  height: 100vh;
}

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