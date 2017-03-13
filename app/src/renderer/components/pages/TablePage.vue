<template>
  <div class="header-page">
    <page-header v-bind:title="`Table '${ schema ? schema + '.' : ''}${ table}'`" v-bind:showBack="true"/>
    <div class="header-page-content-top">
      <table class="snapdiff-data-table">
        <!--Table Options-->
        <tr>
          <td v-bind:colspan="columns.length + 1">
            <label>Rows per page: </label>
            <input type="number" v-model="limit"/>
            <snapdiff-pager :totalRecords="totalRows" :recordsPerPage="limit" :currentPage="currentPage"/>
          </td>
        </tr>
        <!--Table Header-->
        <tr>
          <th v-for="column in columns">
            {{ column.name }}
          </th>
        </tr>
        <!--Table Data-->
        <tr v-for="row in rows">
          <td v-for="column in columns">
            {{ row[column.name] }}
          </td>
        </tr>
        <!--Repeat Pager-->
        <tr>
          <td v-bind:colspan="columns.length + 1">
            <snapdiff-pager :totalRecords="totalRows" :recordsPerPage="limit" :currentPage="currentPage"/>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';
  import SnapdiffPager from '../shared/SnapdiffPager';

  export default {
    name: 'table-page',
    props: ['schema', 'table'],
    created() {
      this.getColumns();
      this.getData();
    },
    components: {
      PageHeader,
      SnapdiffPager,
    },
    data() {
      return {
        limit: 2,
        offset: 0,
        totalRows: 55,
        currentPage: 1,
        columns: [],
        rows: [],
      };
    },
    watch: {
      limit() {
        this.getData();
      },
    },
    methods: {
      getColumns() {
        this.$store
          .dispatch('getTableColumns', {
            schema: this.schema,
            table: this.table,
          })
          .then(results => {
            this.columns = results;
          });
      },
      getCount() {

      },
      getData() {
        this.getRows();
        this.getCount();
      },
      getRows() {
        this.$store
          .dispatch('getTableContents', {
            schema: this.schema,
            table: this.table,
            limit: this.limit,
            offset: this.offset,
          })
          .then(results => {
            this.rows = results;
          });
      },
    },
  };

</script>

<style>

</style>
