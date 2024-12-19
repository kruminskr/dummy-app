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

      <div class="mx-4">
        <h2 class="title is-3 mx-4">Bank account overview: {{ account.name }}</h2>

        <div class="details columns">
          <div class="column is-half mx-4">
            <div class="content">
              <h2 class="title is-4">Details</h2>
              <p class="subtitle is-6">
                <strong>IBAN:</strong> {{ account.iban }}<br>
                <strong>Owner:</strong> {{ account.ownerName }}<br>
                <strong>Currency</strong> {{ account.currency }}<br>
                <strong>Product:</strong> {{ account.product }}<br>
                <strong>Type:</strong> {{ account.cashAccountType }}
              </p>
            </div>
          </div>

          <div class="column is-half is-flex is-flex-direction-column is-justify-content-center">
            <div class="content">
              <p class="is-size-4 has-text-weight-bold mb-0">Balance</p>
              <h2 class="is-4 mt-0">
                {{ balances[1]?.balanceAmount.amount }} {{ balances[1]?.balanceAmount.currency }}
              </h2>
            </div>
          </div>

        </div>

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

            <tbody v-if="balances.length > 0">
              <tr>
                <td>{{ account.name }}</td>
                <td>{{ account.iban }}</td>
                <td>{{ balances[1].balanceAmount.amount }} {{ balances[1].balanceAmount.currency }}</td>
                <td> {{ balances[1].balanceAmount.amount-balances[0].balanceAmount.amount }} {{ balances[0].balanceAmount.currency }}</td>
                <td>{{ balances[0].balanceAmount.amount }} {{ balances[0].balanceAmount.currency }}</td>
                <td>{{ balances[0].referenceDate }}</td>
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

  const balances = ref([])
  const account = ref({})

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


const getAccount = async (accountId) => {
    try {
      const token = Cookies.get('token')

      const accountDetails = await accountStore.getAccount(token, accountId)

      account.value = accountDetails.account;

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

const getAccountBalance = async (accountId) => {
  try {
    const token = Cookies.get('token')

    const accountBalance = await accountStore.getAccountBalance(token, accountId)

    balances.value = accountBalance.balances

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
  