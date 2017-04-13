<template>
  <div class="container">
    <page-header v-bind:title="`Table '${ table.schema ? table.schema + '.' : ''}${ table.name}'`" v-bind:showBack="true" />
      <div class="column">
        <snapshot-select @select="handleSnapshotSelect"/>
        <a class="button" @click="createSnapshot">
          <span class="icon">
            <i class="fa fa-plus"></i>
          </span>
        </a>
        <a class="button" @click="diffSnapsots" :disabled="!table.snapshots.length">
          <span class="icon">
            <i class="fa fa-balance-scale"></i>
          </span>
        </a>
      </div>
      <div class="column">
        <!--Table Pager-->
        <table-pager/>
        <div class="snapdiff-data-table-container">
          <table class="snapdiff-data-table">
            <!--Table Header-->
            <tr>
              <th v-for="column in table.columns">
                <i v-if="table.primaryKeyFields.includes(column.name)" class="fa fa-key"/> {{ column.name }}
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
  import SnapshotSelect from '../shared/SnapshotSelect';

  export default {
    name: 'table-page',
    props: ['schemaName', 'tableName'],
    created() {
      this.setTable();
    },
    components: {
      PageHeader,
      TablePager,
      SnapshotSelect,
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
      createSnapshot() {
        this.$store.dispatch('snapshotTable', {
          schemaName: this.schemaName,
          tableName: this.tableName,
          primaryKeyFields: this.table.primaryKeyFields,
        })
          .then(() => {
            alert('Snapshot created'); // eslint-disable-line
          })
          .catch((err) => {
            alert(err.message); // eslint-disable-line
            this.message = err.message;
          });
      },
      diffSnapsots() {
        if (this.schemaName) {
          this.$router.push({ name: 'schemaDiff', params: {
            schemaName: this.schemaName,
            tableName: this.tableName,
          } });
        } else {
          this.$router.push({ name: 'diff', params: {
            tableName: this.tableName,
          } });
        }
      },
      setTable() {
        this.$store
          .dispatch('setTable', {
            schemaName: this.schemaName,
            tableName: this.tableName,
          });
      },
      handleSnapshotSelect(snapshot) {
        this.$store
          .dispatch('setTableSnapshot', {
            snapshot,
          });
      },
    },
  };

</script>

<style>

</style>
