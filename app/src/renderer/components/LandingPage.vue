<template>
  <div>
    <img src="./LandingPage/assets/logo.png" alt="electron-vue">
    <h1>Welcome.</h1>
    <p>Please ensure your database is running and accessible to your machine before continuing.</p>
    <router-link to="/connect-page">Begin</router-link>

  </div>
</template>

<script>
  export default {
    components: {
    },
    name: 'landing-page',
  };
</script>

<style scoped>
  img {
    margin-top: -25px;
    width: 450px;
  }
</style>
