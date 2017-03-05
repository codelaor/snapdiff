<template>
  <div class="tables">
    <h1>Tables</h1>
    <button v-on:click="disconnect">Disconnect</button>
  </div>
</template>

<script>
  export default {
    name: 'tables',
    data() {
      return {
      };
    },
    watch: {
    },
    methods: {
      disconnect() {
        // TODO disconnect knex connection
        this.$router.push({ name: 'connect' });
      },
    },
  };

</script>

<style>

</style>
