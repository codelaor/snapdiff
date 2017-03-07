<template>
  <div class="header-page-header">
    <div class="header-page-header-left">
      <h1>{{ title }}</h1>
    </div>
    <div class="header-page-header-right">
      <button v-if="connection" v-on:click="disconnect">Disconnect</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page-header',
    props: ['title'],
    data() {
      return {
        connection: this.$store.state.connection.knex,
      };
    },
    watch: {
    },
    methods: {
      disconnect() {
        this.$store.dispatch('disconnect')
          .then(() => this.$router.push({ name: 'connect' }));
      },
    },
  };

</script>

<style>

</style>
