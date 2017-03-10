<template>
  <div class="header-page">
    <page-header title="Tables"/>
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
    name: 'tables-page',
    components: {
      PageHeader,
    },
    data() {
      return {
        tables: this.$store.state.tables,
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
