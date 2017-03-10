<template>
  <div class="header-page">
    <page-header :title="`Database '${databaseTitle}'`"/>
    <div class="header-page-content-top">
      <table>
        <tr>
          <th>
            Name
          </th>
        </tr>
        <tr v-for="table in tables">
          <td>
            <router-link v-bind:to="'/table/' + table.name">{{ table.name }}</router-link>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';

  export default {
    name: 'database-page',
    components: {
      PageHeader,
    },
    data() {
      return {
        tables: this.$store.state.tables,
        connection: this.$store.state.connection,
        databaseTitle: this.$store.getters.databaseTitle,
      };
    },
    watch: {
    },
    methods: {
    },
  };

</script>

<style>

</style>
