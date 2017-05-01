<template>
  <nav v-bind:class="{
    nav: true,
    'has-shadow': !noHome
   }">
    <div class="container">
      <div v-if="!noHome" class="nav-left">
        <b-tooltip label="Sign-out" position="is-bottom">
          <a class="nav-item" v-on:click="goHome">
            <b-icon icon="home"/>
            <img src="../../../../art/banner_logo_nav.png"/>
          </a>
        </b-tooltip>
      </div>
      
      <div class="nav-center">
        <strong class="nav-item" v-if="title">{{ title }}</strong>
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
  props: ['title', 'noHome'],
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
