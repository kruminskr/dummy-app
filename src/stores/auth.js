import { ref } from 'vue'
import { defineStore } from 'pinia'


const useAuthStore = defineStore('auth', () => {
    const method = ref({})
    const authData = ref({})

    return {
        method,
        authData
    }    
})

export default useAuthStore