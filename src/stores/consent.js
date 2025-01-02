import { ref } from 'vue'
import { defineStore } from 'pinia'

import axios from 'axios'

const useConsentStore = defineStore('consent', () => {
    const avaliableMethods = ref([])
    const chosenMethod = ref({})
    const authorisationId = ref({})
    const scaData = ref({})

    const createConsent = async (token, access, accountId = '') => {

        const headers = {
            'Authorization': token
        } 

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        const validUntil = futureDate.toISOString().split('T')[0];

        const frequencyPerDay = access.availableAccounts === "allAccounts" ? 1 : 10;
        const recurringIndicator = access.availableAccounts === "allAccounts" ? false : true;

        const consentDetails = {
            access,
            frequencyPerDay,
            recurringIndicator,
            validUntil,
            combinedServiceIndicator: false
        }

        const body = {
            consentDetails,
            accountId
        }

        const { data } = await axios.post('http://localhost:3000/api/app/consent/redirect', body, { headers })

        return data
    }

    const decoupledConsent = async (token, access, accountId) => {
        const headers = {
            'Authorization': token
        } 

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        const validUntil = futureDate.toISOString().split('T')[0];

        const frequencyPerDay = 10;
        const recurringIndicator = true;

        const consentDetails = {
            access,
            frequencyPerDay,
            recurringIndicator,
            validUntil,
            combinedServiceIndicator: false
        }

        const body = {
            consentDetails,
            accountId
        }

        const { data } = await axios.post('http://localhost:3000/api/app/consent/decoupled', body, { headers })

        return data
    }

    const startSCA = async (token, psuData, accountId) => {
        const headers = {
            'Authorization': token
        } 

        const info = {
            authenticationMethodId: chosenMethod.value.authenticationMethodId,
            psuData
        }

        const body = {
            authorisationId: authorisationId.value.value,
            accountId,
            info
        }

        const { data } = await axios.post('http://localhost:3000/api/app/consent/decoupled/sca/start', body, { headers })

        return data;
    }

    const checkScaStatus = async (token, accountId) => {
        const headers = {
            'Authorization': token
        }
        
        const body = {
            authorisationId: authorisationId.value.value,
            accountId
        }

        const { data } = await axios.post('http://localhost:3000/api/app/consent/decoupled/sca/status', body, { headers })

        return data
    }
       
    return {
        avaliableMethods,
        chosenMethod,
        authorisationId,
        scaData,
        createConsent,
        startSCA,
        checkScaStatus,
        decoupledConsent
    }    
})

export default useConsentStore



