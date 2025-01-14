<!-- Displays information abbout account -->
<template>
    <div class="balance">

      <ConsentError v-if="noConsents" :message="errorMessage"/>

      <!-- Navbar -->
      <nav class="navbar">
        <div class="container">
          <div id="navMenu" class="navbar-menu">
            <div class="navbar-start">
              <a class="navbar-item" @click="redirectAccounts()">Financial Management System</a>
              <a class="navbar-item" @click="redirectTransactions()">Transactions</a>
            </div>

            <div class="navbar-end">
              <a class="navbar-item" @click="logout()">Logout</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Displays account information -->
      <div class="mx-4">
        <h2 class="title is-3 mx-4">Bank account overview: {{ accountStore.balanceAccount.name }}</h2>

        <div class="details columns">
          <div class="column is-half mx-4">
            <div class="content">
              <h2 class="title is-4">Details</h2>
              <p class="subtitle is-6">
                <strong>IBAN:</strong> {{ accountStore.balanceAccount.iban }}<br>
                <strong>Owner:</strong> {{ accountStore.balanceAccount.ownerName }}<br>
                <strong>Currency</strong> {{ accountStore.balanceAccount.currency }}<br>
                <strong>Product:</strong> {{ accountStore.balanceAccount.product }}<br>
                <strong>Type:</strong> {{ accountStore.balanceAccount.cashAccountType }}
              </p>
            </div>
          </div>

          <div class="column is-half is-flex is-flex-direction-column is-justify-content-center">
            <div class="content">
              <p class="is-size-4 has-text-weight-bold mb-0">Balance</p>
              <h2 class="is-4 mt-0">
                {{ accountStore.balances[1]?.balanceAmount.amount }} {{ accountStore.balances[1]?.balanceAmount.currency }}
              </h2>
            </div>
          </div>
        </div>

        <!-- Displays account balance -->
        <div class="balance mx-4 mt-4">
          <h2 class="title is-4 mb-1 mt-4">Balance overview</h2>
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>IBAN</th>
                <th>Balance</th>
                <th>Reserved</th>
                <th>Avaliable balance</th>
                <th>Last updated</th>
              </tr>
            </thead>

            <tbody v-if="accountStore.balances.length > 0">
              <tr>
                <td>{{ accountStore.balanceAccount.name }}</td>
                <td>{{ accountStore.balanceAccount.iban }}</td>
                <td>{{ accountStore.balances[1].balanceAmount.amount }} {{ accountStore.balances[1].balanceAmount.currency }}</td>
                <td> {{ accountStore.balances[1].balanceAmount.amount-accountStore.balances[0].balanceAmount.amount }} {{ accountStore.balances[0].balanceAmount.currency }}</td>
                <td>{{ accountStore.balances[0].balanceAmount.amount }} {{ accountStore.balances[0].balanceAmount.currency }}</td>
                <td>{{ accountStore.balances[0].referenceDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRouter, useRoute  } from 'vue-router'
  import Cookies from 'js-cookie'
  import { useToast } from "vue-toastification";

  import useAccountStore from '../stores/account';

  import ConsentError from '../components/ConsentError.vue';
  
  const route = useRoute();
  const router = useRouter()

  const accountStore = useAccountStore();

  const toast = useToast() 

  const noConsents = ref(false)
  const errorMessage = ref('')
  
  const logout = () => {
    Cookies.remove('token')

    router.push('/')
  }

  const redirectAccounts = () => {
    router.push('/account')
  }
  
  const redirectTransactions = () => {
    const accountId = route.params.id
    router.push(`/account/${accountId}/transactions`)
  }

// Get detailed account information
const getAccount = async (accountId) => {
    try {
      const token = Cookies.get('token')

      await accountStore.getAccount(token, accountId)

      return;
    } catch (error) {
      if (error.response.data[0].code == 'ACCESS_EXCEEDED') {
        noConsents.value = true

        errorMessage.value = error.response.data[0].text;
        return;
      }

      toast.error(error.response.data[0].text || 'An error occurred')
    }
  }

// Get account balance
const getAccountBalance = async (accountId) => {
  try {
    const token = Cookies.get('token')

    await accountStore.getAccountBalance(token, accountId)

    return;
  } catch (error) {
    if (error.response.data[0].code == 'ACCESS_EXCEEDED') {
      noConsents.value = true

      errorMessage.value = error.response.data[0].text;
      return;
      }

      toast.error(error.response.data[0].text || 'An error occurred')
  }
}

onMounted(async () => {
  const token = Cookies.get('token')
  const accountId = route.params.id

  if (!token) {
    router.push('/')
  }

  await getAccount(accountId)
  await getAccountBalance(accountId)
})
</script>

<style scoped>
.balance {
  border-top: 2px solid #dbdbdb; 
}

</style>
  