<template>
  <div class="landing-page">
    <img src="./LandingPage/assets/logo.png" alt="electron-vue">
    <h1>Welcome.</h1>
    <p>Please ensure your database is running and accessible to your machine before continuing.</p>
    <router-link to="/connect">Begin</router-link>

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
  .landing-page {
    width: 100%;
    height: 100%;
    align-items: center;
    background:
      radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      );
    background-position: center;
    display: flex;
    flex-direction: column;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    text-align: center;
  }
</style>
