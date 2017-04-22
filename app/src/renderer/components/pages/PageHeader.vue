<template>
  <nav class="nav has-shadow">
    <div class="container">
      <div class="nav-left">
        <b-tooltip label="Sign-out" position="is-bottom">
          <a class="nav-item" v-on:click="goHome">
            <b-icon icon="home"/>
            <img src="../../../../../art/banner_logo.svg"/>

          </a>
        </b-tooltip>
      </div>
      
      <div class="nav-center">
        <span class="nav-item">{{ databaseTitle }}</span>
      </div>

      <div class="nav-right">
        <b-tooltip label="Quit" position="is-bottom">
          <a class="nav-item" v-on:click="quit">
            <b-icon icon="power_settings_new"/>
          </a>
        </b-tooltip>
      </div>
    </div>
  </nav>
</template>

<script>
import electron from 'electron';
export default {
  name: 'page-header',
  data() {
    return {
      databaseTitle: this.$store.getters.databaseTitle,
      connection: this.$store.state.knex,
    };
  },
  watch: {
  },
  methods: {
    quit() {
      electron.remote.app.quit();
    },
    goHome() {
      this.$store.dispatch('disconnect')
        .then(() => this.$router.push({ name: 'home' }));
    },
  },
};

</script>

<style>

</style>
