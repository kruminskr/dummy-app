// import { ref } from 'vue'
import { defineStore } from 'pinia'

import axios from 'axios'

const useConsentStore = defineStore('consent', () => {
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
        "combinedServiceIndicator": false
        }

        const body = {
            consentDetails,
            accountId
        }

        const { data } = await axios.post('http://localhost:3000/api/app/consent/create', body, { headers })

        return data
    }

    return {
        createConsent,
    }    
})

export default useConsentStore



