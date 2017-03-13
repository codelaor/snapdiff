<template>
  <div class="header-page">
    <page-header v-bind:title="`Table '${ table.schema ? table.schema + '.' : ''}${ table.name}'`" v-bind:showBack="true"/>
    <div class="header-page-content-top">
      <table class="snapdiff-data-table">
        <!--Table Pager-->
        <tr>
          <td v-bind:colspan="table.columns.length + 1">
            <table-pager/>
          </td>
        </tr>
        <!--Table Header-->
        <tr>
          <th v-for="column in table.columns">
            {{ column.name }}
          </th>
        </tr>
        <!--Table Data-->
        <tr v-for="row in table.rows">
          <td v-for="column in table.columns">
            {{ row[column.name] }}
          </td>
        </tr>
        <!--Repeat Pager-->
        <tr>
          <td v-bind:colspan="table.columns.length + 1">
            <table-pager/>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';
  import TablePager from './Table/TablePager';

  export default {
    name: 'table-page',
    props: ['schemaName', 'tableName'],
    created() {
      this.setTable();
    },
    components: {
      PageHeader,
      TablePager,
    },
    computed: {
      table() {
        return this.$store.state.table;
      },
    },
    data() {
      return {
        limit: 2,
        offset: 0,
        totalRows: 55,
        currentPage: 1,
      };
    },
    watch: {
      limit() {
        this.getData();
      },
    },
    methods: {
      setTable() {
        this.$store
          .dispatch('setTable', {
            schemaName: this.schemaName,
            tableName: this.tableName,
          });
      },
    },
  };

</script>

<style>

</style>
