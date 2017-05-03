<template>
  <div class="container">
    <page-header :title="pageTitle" />
    <div class="column">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <b-tooltip label="Go back"
                       position="is-bottom">
              <a v-on:click="$router.go(-1)">
                <b-icon icon="arrow_back" />
              </a>
            </b-tooltip>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-tooltip label="Show current data or snapshot"
                       position="is-bottom">
              <b-radio-group :value="table.showSnapshot"
                             @change="selectShowSnapshot">
                <b-radio :value="false">Current</b-radio>
                <b-radio :value="true"
                         :disabled="!table.snapshotCreated">Snapshot</b-radio>
              </b-radio-group>
            </b-tooltip>
          </div>
          <div class="level-item">
            <b-tooltip label="Refresh current data"
                       position="is-bottom">
              <a class="button"
                 :disabled="table.showSnapshot"
                 @click="refresh">
                <b-icon icon="refresh" />
              </a>
            </b-tooltip>
            <b-tooltip label="Create / update snapshot"
                       position="is-bottom">
              <a class="button"
                 @click="createSnapshot">
                <b-icon icon="archive" />
              </a>
            </b-tooltip>
            <b-tooltip label="Diff snapshot"
                       position="is-bottom">
              <a class="button"
                 @click="gotoDiff"
                 :disabled="!table.snapshotCreated">
                <b-icon icon="compare" />
              </a>
            </b-tooltip>
          </div>
        </div>
      </div>
    </div>
    <!--Tabs-->
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': activeTab === 'Current' }"><a @click="selectTabCurrent">Current data</a></li>
        <li :class="{ 'is-active': activeTab === 'Snapshot' }"><a @click="selectTabSnapshot">Snapshot</a></li>
        <li :class="{ 'is-active': activeTab === 'Diff' }"><a @click="selectTabDiff">Diff</a></li>
      </ul>
    </div>

    <table-data v-if="activeTab === 'Current' || activeTab === 'Snapshot'" />
    <table-diff v-if="activeTab === 'Diff'" />
  </div>
</template>

<script>
import { formatTime } from '../formatters';
import PageHeader from './PageHeader';
import TableData from './TableData';
import TableDiff from './TableDiff';

export default {
  name: 'table-page',
  components: {
    PageHeader,
    TableData,
    TableDiff,
  },
  computed: {
    pageTitle() {
      let title = `Table '${this.table.name}'`;
      if (this.table.showSnapshot) {
        title = `${title} (Snapshot @ ${formatTime(this.table.snapshotCreated)})`;
      }
      return title;
    },
    activeTab() {
      return this.$store.state.pages.table.activeTab;
    },
    table() {
      return this.$store.getters['tables/current'];
    },
  },
  methods: {
    formatTime,
    selectTabCurrent() {
      this.$store
        .dispatch('tables/setCurrentShowSnapshot', {
          showSnapshot: false,
        });
      this.$store.commit('pages/setTableActiveTab', 'Current');
    },
    selectTabSnapshot() {
      this.$store
        .dispatch('tables/setCurrentShowSnapshot', {
          showSnapshot: true,
        });
      this.$store.commit('pages/setTableActiveTab', 'Snapshot');
    },
    selectTabDiff() {
      this.$store.commit('pages/setTableActiveTab', 'Diff');
    },
    onRowSelect(row) {
      const key = {};
      this.table.primaryKeyFields.forEach(field => {
        key[field] = row[field];
      });
      this.$store.commit('tables/setCurrentRowKey', {
        key,
      });
      this.$router.push({
        name: 'row',
      });
    },
    pageChanged(value) {
      this.$store.dispatch('tables/setCurrentPage', value);
    },
    refresh() {
      this.$store.dispatch('tables/setCurrentRows')
        .then(() => {
          this.$snackbar.open('Data refreshed');
        });
    },
    createSnapshot() {
      this.$store.dispatch('tables/snapshotTable', {
        schemaName: this.table.schema,
        tableName: this.table.name,
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
    async gotoDiff() {
      try {
        await this.$store.dispatch('tables/diffTable', {
          schemaName: this.table.schema,
          tableName: this.table.name,
        });
        this.$router.push({
          name: 'tableDiff',
        });
      } catch (err) {
        this.$toast.open({
          message: err.message,
          position: 'bottom-right',
          type: 'is-danger',
        });
      }
    },
    selectShowSnapshot(showSnapshot) {
      this.$store
        .dispatch('tables/setCurrentShowSnapshot', {
          showSnapshot,
        });
    },
  },
};

</script>

<style>

</style>
