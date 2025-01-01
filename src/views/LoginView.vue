<template>
  <div class="columns is-gapless">
    <!-- Left Side -->
    <div class="column is-half is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
      <h1 class="title is-2">Financial managment system</h1>

      <div v-if="!displayMethods" class="is-flex is-flex-direction-row is-align-items-center is-justify-content-center">
        
        <div @click="getAuthMethods('SANDLV22')" class="has-text-centered">
          <button class="button is-grey">Latvia</button>
        </div>

        <div @click="getAuthMethods('SANDLT22')" class="has-text-centered px-6">
          <button class="button is-grey">Lithuania</button>
        </div>

        <div @click="getAuthMethods('SANDEE2X')" class="has-text-centered">
          <button class="button is-grey">Estonia</button>
        </div>
      </div>

      <div v-if="displayMethods" class="is-flex is-flex-direction-row is-align-items-center is-justify-content-center">
        <div v-for="method in methods" :key="method.authenticationMethodId" class="m-2">
          <button @click="method.redirectAuth ? redirectAuth() : goDecoupledAuth(method)" class="button">
            {{ method.authenticationType }}
          </button>
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
import { ref } from 'vue'
import { useToast } from "vue-toastification";
import { useRouter  } from 'vue-router'

import axios from 'axios';

import useAuthStore from '../stores/auth';

const router = useRouter()
const toast = useToast()

const store = useAuthStore()

const displayMethods = ref(false)
const methods = ref([])
const bic = ref('')

const redirectAuth = () => {
  window.location.href = `http://localhost:3000/api/app/auth/redirect`;
};

const goDecoupledAuth = async (method) => {
  store.method = method;
  router.push('/auth')
}

const filterMethods = async () => {
  methods.value = methods.value
    .filter(method => method.authenticationType !== "Biometrics") 
    .map(method => {
      if (method.authenticationMethodId === "EPARAKSTS_MOBILE" || method.authenticationMethodId === "MOBILE_ID") {
        method.decoupledAuth = true; 
      } else {
        method.redirectAuth = true; 
      }

      return method;
    });
}

const getAuthMethods = async (country) => {
  try {
    bic.value = country;
    displayMethods.value = true;

    const redirect = true;

    const body = {
      bic: bic.value,
      redirect
    }

    const { data } = await axios.post('http://localhost:3000/api/app/auth/methods', body)

    methods.value = data
    filterMethods()

    return;
  } catch (error) {
    toast.error(error.response.data[0].text || 'An error occurred')
    return;
  }
}
</script>

<style scoped>
.image {
  object-fit: cover;
  height: 100%;
}

.columns {
  height: 100vh;
}
</style>