<!-- Decoupled authentication -->
<!-- Displays authetication method, message from Swedbank and challenge code -->
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

import useAuthStore from '../stores/auth';

const router = useRouter();

const toast = useToast()

const props = defineProps({
    userId: {
        type: String,
    },
})

const store = useAuthStore()

// Get decoupled authentication status, when successful, redirect to account page
const decoupledAuthStatus = async () => {
  try {
    const authId = store.authData.authorizeId
    const userId = props.userId

    const token = await store.getDecoupledAuthStatus(authId, userId)

    Cookies.set('token', token); 

    router.push('/account')

    return;
  } catch (error) {
    toast.error(error?.response?.data[0].text || error.response.data)

    router.push('/')
    return;
  }
}

onMounted(() => {
    decoupledAuthStatus()
})

</script>