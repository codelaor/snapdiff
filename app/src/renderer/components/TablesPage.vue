<template>
  <div class="header-page">
    <div class="header-page-header">
      <h1>Tables</h1>
    </div>
    <div class="header-page-content-top">
      <button v-on:click="disconnect">Disconnect</button>
      <table>
        <tr>
          <th>
            Name
          </th>
        </tr>
        <tr v-for="table in tables">
          <td>
            {{ table.name }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tables',
    data() {
      return {
        tables: this.$store.state.tables,
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
