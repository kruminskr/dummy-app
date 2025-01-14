import { ref } from 'vue'
import { defineStore } from 'pinia'

import axios from 'axios'

// Account store to manage the state of the account data and handle comunication with the backend
const useAccountStore = defineStore('accounnt', () => {
    const allAccounts = ref([])

    const balanceAccount = ref({})
    const balances = ref([])

    const transactionAccount = ref({})
    const transactions = ref({}) 

    // Get all accounts
    const getAccounts = async (token) => {
          const headers = {
            'Authorization': token
          }
      
          const {data} = await axios.get('http://localhost:3000/api/app/accounts', { headers })
      
          return allAccounts.value = data.accounts
      }
      
    // Get detailed account data by id
    const getAccount = async (token, accountId) => {
        const headers = {
            'Authorization': token
          }
      
          const { data } = await axios.get(`http://localhost:3000/api/app/accounts/${accountId}`, { headers })

          balanceAccount.value = data.account;

          return data;
    }

    // Get account balance by id
    const getAccountBalance = async (token, accountId) => {
        const headers = {
            'Authorization': token
          }
      
          const { data } = await axios.get(`http://localhost:3000/api/app/accounts/${accountId}/balance`, { headers })

          balances.value = data.balances

          return data;
    }

    // Get account transactions by id
    const getAccountTransactions = async (token, accountId, dateFrom, dateTo, status, pageId) => {    
          const headers = {
            'Authorization': token
          }

          const body = {
              dateFrom,
              dateTo,
              status,
              pageId,
          }
    
          const { data } = await axios.post(`http://localhost:3000/api/app/accounts/${accountId}/transactions`, body, { headers })

          transactionAccount.value = data.account
          transactions.value = data.transactions

          return data;
      }

    return {
        allAccounts,
        balances,
        balanceAccount,
        transactionAccount,
        transactions,
        getAccounts,
        getAccount,
        getAccountBalance,
        getAccountTransactions
    }    
})

export default useAccountStore