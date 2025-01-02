<template>
    <div>
        <div class="has-text-centered">
            <h1 class="title is-3">{{ store.authData.chosenScaMethod.authenticationType }}</h1>
            <h1 class="title is-6">{{ store.authData.psuMessage }}</h1>
            <h1 class="title is-4">Code: {{ store.authData.challengeData.code }}</h1>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { defineProps } from 'vue';
import { useToast } from "vue-toastification";
import { useRouter  } from 'vue-router'
import Cookies from 'js-cookie'

import axios from 'axios';

import useAuthStore from '../stores/auth';

const router = useRouter();

const toast = useToast()

const props = defineProps({
    userId: {
        type: String,
    },
})

const store = useAuthStore()

const decoupledAuthStatus = async () => {
  try {
    const body = {
        authId: store.authData.authorizeId,
        userId: props.userId,
    }

    const { data } = await axios.post('http://localhost:3000/api/app/auth/decoupled/status', body)

    Cookies.set('token', data); 

    router.push('/account')

    return;
  } catch (error) {
    toast.error(error?.response?.data[0].text || 'An error occurred')
    return;
  }
}

onMounted(() => {
    decoupledAuthStatus()
})

</script>