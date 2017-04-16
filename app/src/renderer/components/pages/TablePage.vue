<template>
  <div class="container">
    <page-header/>
    <div class="column">
      <div class="nav">
        <div class="nav-left">
          <div class="nav-item">
            <a v-on:click="$router.go(-1)">
              <span class="icon">
                <i class="fa fa-arrow-left"></i>
              </span>
            </a>
          </div>
        </div>
        <div class="nav-center">
          <span class="nav-item">
            Table {{ table.name }}
            <span v-if="table.showSnapshot"> ({{ formatTime(table.snapshotCreated) }})</span>
          </span>
        </div>
        <div class="nav-right">
          <div class="nav-item">
            <span class="is-small">
                  <b-radio-group :value="table.showSnapshot" @change="selectShowSnapshot">
                      <b-radio :value="false">Current</b-radio>
                      <b-radio :value="true" :disabled="!table.snapshotCreated">Snapshot</b-radio>
                  </b-radio-group>
                </span>
            <div class="control">
              <a class="button is-small"
                @click="createSnapshot">
                <span class="icon is-small">
                      <i class="fa fa-clone"></i>
                    </span>
              </a>
            </div>
            <div class="control">
              <a class="button is-small"
                @click="diffSnapsots"
                :disabled="!table.snapshot">
                <span class="icon is-small">
                      <i class="fa fa-balance-scale"></i>
                    </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Table-->
    <b-table :data="table.currentRows"
             :striped="true">
      <!--Table Header-->
      <b-table-column v-for="column in table.columns"
                      :field="column.name"
                      :label="column.name" />
      <!--<i v-if="table.primaryKeyFields.includes(column.name)" class="fa fa-key"/> {{ column.name }}-->
  
    </b-table>
    <!--Repeat Pager-->
    <table-pager/>
  </div>
</template>

<script>
import { formatTime } from '../../formatters';
import PageHeader from './PageHeader';
import TablePager from './Table/TablePager';

export default {
  name: 'table-page',
  props: ['schemaName', 'tableName'],
  created() {
    this.setSelectedTable();
  },
  components: {
    PageHeader,
    TablePager,
  },
  computed: {
    table() {
      return this.$store.getters.table;
    },
  },
  watch: {
    limit() {
      this.getData();
    },
  },
  methods: {
    formatTime,
    createSnapshot() {
      this.$store.dispatch('snapshotTable', {
        schemaName: this.schemaName,
        tableName: this.tableName,
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
        this.$router.push({
          name: 'schemaDiff', params: {
            schemaName: this.schemaName,
            tableName: this.tableName,
          },
        });
      } else {
        this.$router.push({
          name: 'diff', params: {
            tableName: this.tableName,
          },
        });
      }
    },
    setSelectedTable() {
      this.$store
        .dispatch('setSelectedTable', {
          schemaName: this.schemaName,
          tableName: this.tableName,
        });
    },
    selectShowSnapshot(showSnapshot) { // eslint-disable-line
      // debugger; // eslint-disable-line
      this.$store
        .dispatch('setTableShowSnapshot', {
          showSnapshot,
        });
    },
  },
};

</script>

<style>

</style>
