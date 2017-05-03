<template>
  <nav v-bind:class="{
        nav: true,
        'has-shadow': $route.name !== 'home'
       }">
    <div v-if="$route.name !== 'home'" class="nav-left">
      <a class="nav-item" v-on:click="goHome">
        <b-tooltip label="Sign-out" position="is-right">
          <b-icon icon="home" />
        </b-tooltip>
      </a>
      <a class="nav-item" v-if="$route.name !== 'database'" v-on:click="$router.go(-1)">
        <b-tooltip label="Go back" position="is-right">
          <b-icon icon="arrow_back" />
        </b-tooltip>
      </a>
    </div>
  
    <div v-if="$route.name !== 'home'" class="nav-center">
      <img class="nav-item" src="../../../../art/banner_logo_nav.png" />
    </div>
  
    <div class="nav-right">
      <b-tooltip label="Quit" position="is-bottom">
        <a class="nav-item" v-on:click="quit">
          <b-icon icon="power_settings_new" />
        </a>
      </b-tooltip>
    </div>
  </nav>
</template>

<script>
import electron from 'electron';
export default {
  name: 'page-header',
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
