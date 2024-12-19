import { ref } from 'vue'
import { defineStore } from 'pinia'

import axios from 'axios'

const useAccountStore = defineStore('accounnt', () => {
    const accounts = ref([])

    const getAccounts = async (token) => {
          const headers = {
            'Authorization': token
          }
      
          const {data} = await axios.get('http://localhost:3000/api/app/accounts', { headers })
      
          return accounts.value = data.accounts
      }
      
    const getAccount = async (token, accountId) => {
        const headers = {
            'Authorization': token
          }
      
          const { data } = await axios.get(`http://localhost:3000/api/app/accounts/${accountId}`, { headers })

          return data;
    }

    const getAccountBalance = async (token, accountId) => {
        const headers = {
            'Authorization': token
          }
      
          const { data } = await axios.get(`http://localhost:3000/api/app/accounts/${accountId}/balance`, { headers })

          return data;
    }

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
      
          return data;
      }

    return {
        accounts,
        getAccounts,
        getAccount,
        getAccountBalance,
        getAccountTransactions
    }    
})

export default useAccountStore