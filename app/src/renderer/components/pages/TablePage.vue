<template>
  <div class="container">
    <page-header v-bind:title="`Table '${ table.schema ? table.schema + '.' : ''}${ table.name}'`" v-bind:showBack="true" />
      <div class="column">
        <div class="field has-addons">
          <div class="control">
            <snapshot-select @select="handleSnapshotSelect"/>
          </div>
          <div class="control">
            <a class="button is-small" @click="createSnapshot">
              <span class="icon is-small">
                <i class="fa fa-clone"></i>
              </span>
            </a>
          </div>
          <div class="control">
            <a class="button is-small" @click="diffSnapsots" :disabled="!table.snapshots.length">
              <span class="icon is-small">
                <i class="fa fa-balance-scale"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
        <!--Table Pager-->
        <table-pager/>
        <b-table :data="table.currentRows" :striped="true">
          <!--Table Header-->
            <b-table-column v-for="column in table.columns" :field="column.name" :label="column.name"/>
              <!--<i v-if="table.primaryKeyFields.includes(column.name)" class="fa fa-key"/> {{ column.name }}-->

        </b-table>
        <!--Repeat Pager-->
        <table-pager/>
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
        console.log('show snapshot', (snapshot !== '')); // eslint-disable-line
        this.$store
          .dispatch('setTableShowSnapshot', {
            showSnapshot: (snapshot !== ''),
          });
      },
    },
  };

</script>

<style>

</style>
