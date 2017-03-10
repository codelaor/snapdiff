<template>
  <div class="header-page-header">
    <div class="header-page-header-left">
      <button v-if="showHome" v-on:click="goHome"><icon name="home"></icon></button>
      <button v-if="showBack" v-on:click="$router.go(-1)"><icon name="arrow-left"/></button>
      <span class="header-title">{{ title }}</span>
    </div>
    <div class="header-page-header-right">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page-header',
    props: {
      showHome: {
        type: Boolean,
        default: true,
      },
      showBack: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: 100,
      },
    },
    data() {
      return {
        connection: this.$store.state.connection.knex,
      };
    },
    watch: {
    },
    methods: {
      goHome() {
        this.$store.dispatch('disconnect')
          .then(() => this.$router.push({ name: 'home' }));
      },
    },
  };

</script>

<style>

</style>
