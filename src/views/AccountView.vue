<!-- Displays all user accounts -->
<template>
  <div class="accounts" :class="{ 'blured': helperStore.viewConsentMethods || helperStore.viewConsentData || helperStore.viewConsentSign }">

    <!-- Navbar -->
    <nav class="navbar">
      <div class="container">
        <div id="navMenu" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item">Financial Management System</a>
          </div>

          <div class="navbar-end">
            <a class="navbar-item" @click="logout()">Logout</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content Section -->
    <div class="container mt-4">
      <h1 class="title is-4">Your Accounts</h1>

      <!-- Table -->
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Name</th>
            <th>IBAN</th>
            <th>Currency</th>
            <th>Product</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>

        <tbody v-for="account in accountStore.allAccounts" :key="account.resourceId">

          <!-- Account Row -->
          <tr>
            <td>{{ account.name }}</td>
            <td>{{ account.iban }}</td>
            <td>{{ account.currency }}</td>
            <td>{{ account.product }}</td>
            <td>{{ account.cashAccountType }}</td>
            <td>
              <button class="button is-small" @click="helperStore.toggleDropdown(account.resourceId)" >
                {{ helperStore.expandedRows[account.resourceId] ? 'Hide Details' : 'Show Details' }}
              </button>
            </td>
          </tr>

          <!-- Dropdown -->
          <tr v-if="helperStore.expandedRows[account.resourceId]">
            <td colspan="6" class="dropdown-container">
              <!-- warning about the need to sign consent -->
              <ConsentInfo v-if="helperStore.viewConesntInfo" :account="account" />

              <!-- Consent signing Methods -->
              <div v-if="helperStore.viewConsentMethods">
                <div  class="modal is-active">
                  <div class="modal-background"></div>
                  <div class="modal-card">
                    <header class="modal-card-head"></header>
                    <section class="modal-card-body">
                      <ConsentMethods :account="account" class="active" />
                    </section>
                    <footer class="modal-card-foot"></footer>
                  </div>
                </div>
              </div>

              <!-- Input user data -->
              <div v-if="helperStore.viewConsentData">
                <div  class="modal is-active">
                  <div class="modal-background"></div>
                  <div class="modal-card">
                    <header class="modal-card-head"></header>
                    <section class="modal-card-body">
                      <ConsentData  :account="account" class="active" />
                    </section>
                    <footer class="modal-card-foot"></footer>
                  </div>
                </div>
              </div>

              <!-- Await consent signing status -->
              <div v-if="helperStore.viewConsentSign">
                <div  class="modal is-active">
                  <div class="modal-background"></div>
                  <div class="modal-card">
                    <header class="modal-card-head"></header>
                    <section class="modal-card-body">
                      <ConsentSign  :account="account" class="active"/>
                    </section>
                    <footer class="modal-card-foot"></footer>
                  </div>
                </div>
              </div>

            </td>
          </tr>

        </tbody>
      </table>

    </div>
    
  </div>
</template>


<script setup>
import { useRouter, useRoute  } from 'vue-router'
import { onMounted } from 'vue'
import Cookies from 'js-cookie'
import { useToast } from "vue-toastification";

import ConsentInfo from '../components/ConsentInfo.vue';
import ConsentMethods from '../components/ConsentMethods.vue';
import ConsentData from '../components/ConsentData.vue';
import ConsentSign from '../components/ConsentSign.vue';

import useConsentStore from '../stores/consent'
import useAccountStore from '../stores/account'
import useHelperStore from '../stores/helper'

const consentStore = useConsentStore()
const accountStore = useAccountStore()
const helperStore = useHelperStore()

const route = useRoute();
const router = useRouter()

const toast = useToast()

var allAccountToken;

const logout = () => {
  Cookies.remove('token')

  router.push('/')
}

// Create consent for all accounts
const createAllAccountConsent = async () => {
  try {
    const token = Cookies.get('token')

    const access = {
      "availableAccounts": "allAccounts"
    }

    const consent = await consentStore.createConsent(token, access)


    if (consent.consentStatus === "received") {
      logout()
    }

    allAccountToken = consent.token

    return;
  } catch (error) {
    toast.error(error?.response?.data[0].text || 'An error occurred')
  }
}

// Get all accounts
const getAccounts = async () => {
  try {
    await accountStore.getAccounts(allAccountToken)

    return;
  } catch (error) {
    toast.error(error.response.data[0].text || 'An error occurred')
  }
}

onMounted(async () => {
  if (!Cookies.get('token')) {
    const token = route.query.token;
    
    if (!token) {
      router.push('/')
    }

    Cookies.set('token', token);  
  }

  await createAllAccountConsent(); 
  await getAccounts();
})
</script>
