import { ref } from 'vue'
import { defineStore } from 'pinia'

import axios from 'axios'

// Auth store to manage the state of the auth data and handle comunication with the backend
const useAuthStore = defineStore('auth', () => {
    const method = ref({})
    const authData = ref({})

    // Initiates the decoupled auth process
    const initiateDecoupledAuth = async (body) => {
        const { data } = await axios.post('http://localhost:3000/api/app/auth/decoupled/start', body)
    
        authData.value = data;

        return;
    }

    // Get the status of the decoupled auth process
    const getDecoupledAuthStatus = async (authId, userId) => {
        const body = {
            authId,
            userId
        }
    
        const { data } = await axios.post('http://localhost:3000/api/app/auth/decoupled/status', body)

        return data;
    }

    return {
        method,
        authData,
        initiateDecoupledAuth,
        getDecoupledAuthStatus
    }    
})

export default useAuthStore