<template>
  <div class="header-page">
    <page-header v-bind:title="`Table '${ table.schema ? table.schema + '.' : ''}${ table.name}'`" v-bind:showBack="true"/>
    <div class="header-page-content-top">
      <div class="header-page-toolbar-top">
        Snapshot:
        <select :value="table.snapshot" @input="handleSnapshotSelect">
          <option value="">Current data</option>
          <option value disabled>—————————————</option>
          <option v-for="snapshot in table.snapshots" :value="snapshot.created">{{ snapshot.created.toTimeString() }}</option>
        </select>
      </div>
      <!--Table Pager-->
      <table-pager/>
      <div class="snapdiff-data-table-container">
        <table class="snapdiff-data-table">
          <!--Table Header-->
          <tr>
            <th v-for="column in table.columns">
              {{ column.name }}
            </th>
          </tr>
          <!--Table Data-->
          <tr v-for="row in table.currentRows">
            <td v-for="column in table.columns">
              {{ row[column.name] }}
            </td>
          </tr>
        </table>
      </div>
      <!--Repeat Pager-->
      <table-pager/>
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
      handleSnapshotSelect(event) {
        console.log(event.target.value)//eslint-disable-line
        debugger;//eslint-disable-line
        this.$store
          .dispatch('setTableSnapshot', {
            snapshot: event.target.value,
          });
      },
    },
  };

</script>

<style>

</style>
