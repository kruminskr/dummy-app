<!-- View account transactions -->
<template>
    <div class="balance">

    <ConsentError v-if="noConsents" :message="errorMessage"/>

    <!-- Navbar -->
    <nav class="navbar">
      <div class="container">
        <div id="navMenu" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item" @click="goAccounts()">Financial Management System</a>
            <a class="navbar-item" @click="redirectBalance()">Overview</a>
          </div>

          <div class="navbar-end">
            <a class="navbar-item" @click="logout()">Logout</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content Section -->
    <div class="transactions mx-4">
      <h2 class="title is-3 mx-4 mb-2">Transaction overview</h2>

      <!-- Account details -->
      <div class="details mx-4 pb-3">
        <h2 class="title is-5 mb-1">Account</h2>
        <p>
          <strong>IBAN:</strong> {{ store.transactionAccount.iban }}<br>
          <strong>Owner:</strong> {{ store.transactionAccount.ownerName }}
        </p>
      </div>

      <!-- Table -->
      <div class="transaction-table mx-4">
        <table v-if="store.transactions.pending || store.transactions.booked" class="table is-fullwidth">

          <!-- Header -->
          <thead>
            <tr>
              <th>
                <div class="date-picker">
                  <label for="dateTo px-2">From </label>
                  <input type="date" id="dateFrom" v-model="dateFrom" :max="dateTo" @change="getAccountTransactions(dateFrom, dateTo, status)"/>
                  <label for="dateTo">to</label>
                  <input type="date" id="dateTo" v-model="dateTo" :min="dateFrom" @change="getAccountTransactions(dateFrom, dateTo, status)"/>
                </div>
              </th>
              <th class="has-text-centered">Amount</th>
              <th class="has-text-centered">Currency</th>
              <th class="has-text-centered">
                <div class="status-filter">
                  <label for="status" class="mr-2">Status:</label>
                  <select id="status" v-model="status" @change="getAccountTransactions(dateFrom, dateTo, status)">
                    <option value="both">Both</option>
                    <option value="booked">Booked</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </th>
              <th class="description">Description</th>
            </tr>
          </thead>

          <tbody v-for="transaction in [...(store.transactions.pending || []), ...(store.transactions.booked || []) ]" :key="transaction.transactionId">
            <!-- Transaction information -->
            <tr class="is-clickable" @click="toggleDropdown(transaction.transactionId)">
              <td>
                {{ transaction.valueDate }}
              </td>
              <td class="has-text-centered" :class="{'has-text-danger': transaction.transactionAmount.amount < 0, 'has-text-success': transaction.transactionAmount.amount > 0}">
              {{ transaction.transactionAmount.amount }}
              </td>              
              <td class="has-text-centered">
                {{ transaction.transactionAmount.currency }}
              </td>
              <td class="has-text-centered">
                <span class="has-text-warning" v-if="(store.transactions.pending || []).includes(transaction)">
                  Pending
                </span>
                <span class="has-text-success" v-else>
                  Booked
                </span>
              </td>              
              <td>
                {{ transaction.remittanceInformationUnstructured }}
              </td>
            </tr>

            <!-- Detailed transaction information -->
            <tr v-if="expandedRows[transaction.transactionId]" class="expanded-row">
              <td colspan="5">
                <h2 class="title is-5 mb-1">Transaction details</h2>
                <div class="expanded-content columns is-multiline">

                  <div class="column">
                    <p><strong>Amount:</strong> <span class="value">{{ transaction.transactionAmount.amount }}</span></p>
                    <p><strong>Currency:</strong> <span class="value">{{ transaction.transactionAmount.currency }}</span></p>
                    <p><strong>Status:</strong> <span class="value">Booked</span></p>
                  </div>

                  <div class="column">
                    <p><strong>Transaction Date:</strong> <span class="value">{{ transaction.transactionDate }}</span></p>
                    <p><strong>Booking Date:</strong> <span class="value">{{ transaction.bookingDate }}</span></p>
                    <p><strong>Effective Date:</strong> <span class="value">{{ transaction.valueDate }}</span></p>
                  </div>

                  <div class="column">
                    <p><strong>Category:</strong> <span class="value">{{ transactionCategory(transaction.bankTransactionCode) }}</span></p>
                    <p><strong>Type:</strong> <span class="value">{{ transactionType(transaction.bankTransactionCode) }}</span></p>
                    <p><strong>Method:</strong> <span class="value">{{ transactionMethod(transaction.bankTransactionCode) }}</span></p>

                  </div>

                  <div class="column">
                    <p><strong>ID:</strong> <span class="value">{{ transaction.transactionId }}</span></p>
                    <p><strong>Bank Transaction Code:</strong> <span class="value">{{ transaction.bankTransactionCode }}</span></p>
                    <p><strong>Description:</strong> <span class="value">{{ transaction.remittanceInformationUnstructured }}</span></p>
                  </div>

                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination is-pulled-right" v-if="pagination.nextPage">
          <button class="button" @click="loadNextPage()" :disabled="!pagination.nextPage">Next Page</button>
        </div>

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
const store = useAccountStore()

const toast = useToast()

const expandedRows = ref({});

const noConsents = ref(false)
const errorMessage = ref('')

const toggleDropdown = (transactionId) => {
  if (!transactionId) {
    toast.info('Pending transactions dont have additional details'); 
    return;
  }

  expandedRows.value[transactionId] = !expandedRows.value[transactionId];
  return;
};

const transactionCategory = (bankTransactionCode) => {
  const categoryMap = {
    PMNT: 'Payment',
  };

  const code = bankTransactionCode.split('-')[0];
  return categoryMap[code] || 'Unknown Category';
};

const transactionType = (bankTransactionCode) => {
  const typeMap = {
    ICDT: 'Issued Credit transfer',
    CCRD: 'Card Transaction',
    RCDT: 'Refund Credit',
  };

  const code = bankTransactionCode.split('-')[1];
  return typeMap[code] || 'Unknown Type';
};

const transactionMethod = (bankTransactionCode) => {
  const methodMap = {
    ESCT: 'Electronic Transfer (SEPA)',
    POSD: 'Point of Sale (Debit)',
    CWDL: 'Cash Withdrawal',
    BOOK: 'Booking Transaction',
    CHRG: 'Card Charge',
  };

  const code = bankTransactionCode.split('-')[2];
  return methodMap[code] || 'Unknown Method';
};

const dateNow = new Date()
const dateBefore = new Date()

dateBefore.setDate(dateBefore.getDate() - 30);

const dateTo = ref(dateNow.toISOString().split('T')[0]);
const dateFrom = ref(dateBefore.toISOString().split('T')[0]);

const status = ref('both')

const pagination = ref({
  previosPage: null,
  nextPage: null, 
});

const loadNextPage = () => {
  const urlParams = new URLSearchParams(pagination.value.nextPage.split('?')[1]);
  const pageId = urlParams.get('pageId');

  getAccountTransactions(dateFrom.value, dateTo.value, status.value, pageId)

  return;
}

const logout = () => {
  Cookies.remove('token')

  return router.push('/')
}

const goAccounts = () => {
  return router.push('/account')
} 

const redirectBalance = () => {
  const accountId = route.params.id
  router.push(`/account/${accountId}/balance`)
}

// Get account transactions
const getAccountTransactions = async (dateFrom, dateTo, status, pageId = null) => {
    try {
      const token = Cookies.get('token')

      const accountId = route.params.id

      const accountTransactions = await store.getAccountTransactions(token, accountId, dateFrom, dateTo, status, pageId)

      pagination.value.nextPage = accountTransactions?._links?.nextPage.href || null

      return;
    } catch (error) {
      if (error.response.data[0].code == 'ACCESS_EXCEEDED') {
        noConsents.value = true

        errorMessage.value = error.response.data[0].text;
        return;
      }

      toast.error(error.response?.data[0].text || 'An error occurred')
    }
  }

onMounted(async () => {
  const token = Cookies.get('token')

  if (!token) {
    logout()
  }

  if (store.transactionAccount.iban) {
    return;
  }

  getAccountTransactions(dateFrom.value, dateTo.value, status.value)
})
</script>

<style scoped>
.details {
  border-bottom: 2px solid #dbdbdb; 
}
.description {
  width: 28%;
}

strong {
  color: rgb(145, 143, 143);
}

.date-picker {
  display: flex;
  align-items: center;
  width: 7vw !important;
}
</style>