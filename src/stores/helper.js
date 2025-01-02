import { ref } from 'vue'
import { defineStore } from 'pinia'

const useHelperStore = defineStore('helper', () => {
    const expandedRows = ref({});
    const viewConesntInfo = ref(true);
    const viewConsentMethods = ref(false);
    const viewConsentData = ref(false);
    const viewConsentSign = ref(false);

    const toggleDropdown = (resourceId) => {
        const isAlreadyOpen = expandedRows.value[resourceId]; 
    
        Object.keys(expandedRows.value).forEach((key) => {
            expandedRows.value[key] = false;
        });
    
        expandedRows.value[resourceId] = !isAlreadyOpen;
    };


    return {
        expandedRows,
        viewConesntInfo,
        viewConsentMethods,
        viewConsentData,
        viewConsentSign,
        toggleDropdown
    }    
})

export default useHelperStore