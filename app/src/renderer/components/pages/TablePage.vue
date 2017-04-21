<template>
  <div class="container">
    <page-header/>
    <div class="column">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <b-tooltip label="Go back" position="is-bottom">
              <a v-on:click="$router.go(-1)">
                <b-icon icon="arrow_back"/>
              </a>
            </b-tooltip>
          </div>
        </div>
        <div class="level-center">
          <span class="level-item">
            Table {{ table.name }}
            <span v-if="table.showSnapshot">&nbsp;({{ formatTime(table.snapshotCreated) }})</span>
          </span>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-tooltip label="Show current data or snapshot" position="is-bottom">
              <b-radio-group :value="table.showSnapshot" @change="selectShowSnapshot">
                  <b-radio :value="false">Current</b-radio>
                  <b-radio :value="true" :disabled="!table.snapshotCreated">Snapshot</b-radio>
              </b-radio-group>
            </b-tooltip>
          </div>
          <div class="level-item">
              <b-tooltip label="Refresh current data" position="is-bottom">
                <a class="button"
                  :disabled="table.showSnapshot"
                  @click="refresh">
                  <b-icon icon="refresh"/>
                </a>
              </b-tooltip>
              <b-tooltip label="Create / update snapshot" position="is-bottom">
                <a class="button"
                  @click="createSnapshot">
                  <b-icon icon="content_copy"/>
                </a>
              </b-tooltip>
              <b-tooltip label="Diff snapshot with current data" position="is-bottom">
                <a class="button"
                  @click="diffSnapsots"
                  :disabled="!table.snapshotCreated">
                  <b-icon icon="compare"/>
                </a>
              </b-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!--Table-->
    <div class="scrollWrapper">
      <b-table :data="table.currentRows"
              :striped="true">
        <!--Table Header-->
        <b-table-column v-for="column in table.columns"
                        :field="column.name"
                        :label="column.name" />
        <!--<i v-if="table.primaryKeyFields.includes(column.name)" class="fa fa-key"/> {{ column.name }}-->
    
      </b-table>
    </div>
    <!--Pager-->
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
    refresh() {
      this.$store.dispatch('setSelectedTableCurrentRows')
        .then(() => {
          this.$snackbar.open('Data refreshed');
        });
    },
    createSnapshot() {
      this.$store.dispatch('snapshotTable', {
        schemaName: this.schemaName,
        tableName: this.tableName,
      })
        .then(() => {
          this.$snackbar.open('Snapshot created');
        })
        .catch((err) => {
          this.$toast.open({
            message: err.message,
            position: 'bottom-right',
            type: 'is-danger',
          });
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
    selectShowSnapshot(showSnapshot) {
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
