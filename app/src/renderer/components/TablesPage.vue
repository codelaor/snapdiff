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
            {{ table.name }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';

  export default {
    name: 'tables',
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
