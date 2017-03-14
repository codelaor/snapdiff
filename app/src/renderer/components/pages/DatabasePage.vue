<template>
  <div class="header-page">
    <page-header :title="`Database '${databaseTitle}'`"/>
    <div class="header-page-content-top">
      <p v-if="!tables.length">
        No tables found in 'database' {{ databaseTitle }} (system tables are excluded.)
      </p>
      <table class="snapdiff-data-table" v-if="tables.length">
        <tr>
          <th v-if="client.hasSchemas">
            Schema
          </th>
          <th>
            Name
          </th>
        </tr>
        <tr v-for="table in tables">
          <td v-if="client.hasSchemas">
            {{ table.schema }}
          </td>
          <td>
            <router-link v-if="table.schema" v-bind:to="`/schema/${table.schema}/table/${table.name}`">{{ table.name }}</router-link>
            <router-link v-if="!table.schema" v-bind:to="`/table/${table.name}`">{{ table.name }}</router-link>
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
    computed: {
      client() {
        return this.$store.getters.connectionClient;
      },
    },
  };

</script>

<style>

</style>
