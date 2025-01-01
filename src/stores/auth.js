import { ref } from 'vue'
import { defineStore } from 'pinia'


const useAuthStore = defineStore('auth', () => {
    const method = ref({})

    return {
        method
    }    
})

export default useAuthStore