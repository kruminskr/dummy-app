<template>
  <div class="columns is-gapless">
    <!-- Left Side -->
    <div class="column is-half is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
      <h1 class="title is-2">Financial managment system</h1>
      <button class="button is-grey mt-2" @click="redirectSwedbank()">Authenticate</button>
    </div>

    <!-- Right Side -->
    <div class="column is-half">
      <img src="../assets/img/login-bg.jpg" alt="Login Background" class="image is-fullwidth is-fullheight"/>
    </div>
  </div>
</template>

<script setup>
const redirectSwedbank = () => {
  window.location.href = 'http://localhost:3000/api/app/auth';
}
</script>

<style scoped>
.image {
  object-fit: cover;
  height: 100%;
}

.columns {
  height: 100vh;
}
</style>