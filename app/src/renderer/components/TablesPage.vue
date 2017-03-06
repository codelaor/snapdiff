<template>
  <div class="header-page">
    <div class="header-page-header">
      <h1>Tables</h1>
    </div>
    <div class="header-page-content-top">
      <button v-on:click="disconnect">Disconnect</button>
      <p>{{ props }}</p>
      <p>{{ tables }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tables',
    data() {
      return {
        tables: this.$store.state.tables,
        props: this.$store.state.connection.props,
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
