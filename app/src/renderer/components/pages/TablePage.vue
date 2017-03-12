<template>
  <div class="header-page">
    <page-header v-bind:title="`Table '${ schema ? schema + '.' : ''}${ table}'`" v-bind:showBack="true"/>
    <div class="header-page-content-top">
      <table class="snapdiff-data-table">
        <tr>
          <th v-for="column in columns">
            {{ column.name }}
          </th>
        </tr>
        <tr v-for="row in rows">
          <td v-for="column in columns">
            {{ row[column.name] }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';

  export default {
    name: 'table-page',
    props: ['schema', 'table'],
    created() {
      this.getColumns();
      this.getRows();
    },
    components: {
      PageHeader,
    },
    data() {
      return {
        limit: 25,
        offset: 0,
        columns: [],
        rows: [],
      };
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
