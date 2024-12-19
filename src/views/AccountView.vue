<template>
  <div class="accounts">

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

        <tbody v-for="account in accountStore.accounts" :key="account.resourceId">

          <!-- Account Row -->
          <tr>
            <td>{{ account.name }}</td>
            <td>{{ account.iban }}</td>
            <td>{{ account.currency }}</td>
            <td>{{ account.product }}</td>
            <td>{{ account.cashAccountType }}</td>
            <td>
              <button class="button is-small" @click="toggleDropdown(account.resourceId)" >
                {{ expandedRows[account.resourceId] ? 'Hide Details' : 'Show Details' }}
              </button>
            </td>
          </tr>

          <!-- Dropdown -->
          <tr v-if="expandedRows[account.resourceId]">
            <td colspan="6">
              <div>

                <!-- Explanation Section -->
                <h2 class="title is-5">Consent Options for Account: {{ account.name }}</h2>
       
                <ul class="content">
                  <li>
                    <strong>Account, Balances, and Transactions Access:</strong> Allows access to the account's basic details, balance, and transactions within the last 90 days.
                  </li>
                  <!-- <li>
                    <strong>Transactions Over 90 Days:</strong> Grants access to transactions older than 90 days.
                  </li> -->
                </ul>

                <!-- Consent Options -->
                <div class="field">
                  <label class="checkbox">
                    <input type="checkbox" v-model="consentOptions.account"/>
                      Access account, balance, and transaction
                  </label>
                </div>
                <!-- <div class="field">
                  <label class="checkbox">
                    <input type="checkbox" v-model="consentOptions.transactionsOver90Days" />
                     Access to transactions over 90 days
                  </label>
                </div> -->

                <!-- Actions -->
                <button class="button mt-3 mr-2" @click="toggleDropdown(account.resourceId)">Cancel</button>
                <button class="button is-light mt-3" @click="createDetailedConsent(account)" :disabled="!hasSelectedConsentOptions">Confirm Consent</button>

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
import { onMounted, ref, computed } from 'vue'
import Cookies from 'js-cookie'
import { useToast } from "vue-toastification";

import useConsentStore from '../stores/consent'
import useAccountStore from '../stores/account'

const consentStore = useConsentStore()
const accountStore = useAccountStore()

const route = useRoute();
const router = useRouter()

const toast = useToast()

var allAccountToken;

const expandedRows = ref({});

const logout = () => {
  Cookies.remove('token')

  router.push('/')
}

const toggleDropdown = (resourceId) => {
  expandedRows.value[resourceId] = !expandedRows.value[resourceId];
};

const hasSelectedConsentOptions = computed(() => {
  const basicSelected = consentOptions.value.account;

  return basicSelected
});

const createAllAccountConsent = async () => {
  try {
    const token = Cookies.get('token')

    const access = {
      "availableAccounts": "allAccounts"
    }

    const consent = await consentStore.createConsent(token, access)

    allAccountToken = consent.token

    return;
  } catch (error) {
    toast.error(error.response.data[0].text || 'An error occurred')
  }
}

const consentOptions = ref({
      account: false,
      transactionsOver90Days: false,
    });

const createDetailedConsent = async (account) => {
  try {
    const token = Cookies.get('token')

    const access = {};
    if (consentOptions.value.account) {
      access.accounts = [{ iban: account.iban }];
      access.balances = [{ iban: account.iban }];
      access.transactions = [{ iban: account.iban }];
    }
    if (consentOptions.value.transactionsOver90Days) {
      access.transactionsOver90Days = [{ iban: account.iban }];
    }

    if (Object.keys(access).length === 0) {
      toast.warning('No consent options selected')
      return;
    }

    const consent = await consentStore.createConsent(token, access, account.resourceId)

    Cookies.set('token', consent.token); 

    return window.location.href = consent._links.scaRedirect.href;
  } catch (error) {
    toast.error(error.response.data[0].text || 'An error occurred')
  }
}

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
    Cookies.set('token', token);  
  }

  await createAllAccountConsent(); 
  await getAccounts();
})
</script>