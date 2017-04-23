<template>
  <nav class="nav has-shadow">
    <div class="container">
      <div class="nav-left">
        <b-tooltip label="Sign-out" position="is-bottom">
          <a class="nav-item" v-on:click="goHome">
            <b-icon icon="home"/>
            <img src="../../../../art/banner_logo.svg"/>
          </a>
        </b-tooltip>
      </div>
      
      <div class="nav-center">
        <span class="nav-item" v-if="title">{{ title }}</span>
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
  props: ['title'],
  data() {
    return {
      connection: this.$store.state['connection/knex'],
    };
  },
  watch: {
  },
  methods: {
    quit() {
      electron.remote.app.quit();
    },
    goHome() {
      this.$store.dispatch('connection/disconnect')
        .then(() => this.$router.push({ name: 'home' }));
    },
  },
};

</script>

<style>

</style>
