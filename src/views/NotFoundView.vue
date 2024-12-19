<template>
    <section class="hero is-info is-large">
        <div class="hero-head">
            <nav class="navbar">
            <div class="container">
                <div class="navbar-brand">
                <a class="navbar-item">
                    <img src="https://bulma.io/assets/images/bulma-type-white.png" alt="Logo" />
                </a>
                </div>
            </div>
            </nav>
        </div>

        <div class="hero-body">
            <div class="container has-text-centered">
            <h1 class="title">404 - Page not found</h1>
            <button class="button is-dark" @click="home()">Go Home</button>
        </div>
        </div>

        <div class="hero-foot">
        </div>
    </section> 
</template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const home = () => {
    router.push('/')
  }
  </script>
  
  
  