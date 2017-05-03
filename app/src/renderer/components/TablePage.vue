<template>
  <div class="container">
    <page-header/>
    <div class="column">
      <!--Content header / toolbar-->
      <div class="columns">
        <div class="column">
          <!--Breadcrumbs-->
          <div class="level">
            <div class="level-right">
              <breadcrumbs class="is-half" />
            </div>
          </div>
        </div>
        <div class="column is-narrow">
          <!--Toolbar-->
          <div class="level">
            <div class="level-right">
              <a class="level-item" :disabled="table.showSnapshot" @click="refresh">
                <b-tooltip label="Refresh current data" position="is-bottom">
                  <b-icon icon="refresh" />
                  <span>Refresh</span>
                </b-tooltip>
              </a>
              <a class="level-item" @click="createSnapshot">
                <b-tooltip label="Create / update snapshot" position="is-bottom">
                  <b-icon icon="archive" />
                  <span>Snapshot</span>
                </b-tooltip>
              </a>
              <a class="level-item" @click="gotoDiff" :disabled="!table.snapshotCreated">
                <b-tooltip label="Diff snapshot" position="is-bottom">
                  <b-icon icon="compare" />
                  <span>Diff</span>
                </b-tooltip>
              </a>
            </div>
          </div>
        </div>
      </div>
  
      <!--Tabs-->
      <div class="tabs is-boxed">
        <ul>
          <li :class="{ 'is-active': activeTab === 'Current' }"><a @click="selectTabCurrent">Current data</a></li>
          <li :class="{ 'is-active': activeTab === 'Snapshot' }">
            <a @click="selectTabSnapshot">Snapshot
                  <span v-if="table.snapshotCreated">&nbsp;@ {{ formatTime(table.snapshotCreated)}}</span>
                </a></li>
          <li :class="{ 'is-active': activeTab === 'Diff' }"><a @click="selectTabDiff">Diff</a></li>
        </ul>
      </div>
  
      <!--Tab content-->
      <table-data v-if="activeTab === 'Current' || activeTab === 'Snapshot'" />
      <table-diff v-if="activeTab === 'Diff'" />
    </div>
  
  </div>
</template>

<script>
import { formatTime } from '../formatters';
import PageHeader from './PageHeader';
import Breadcrumbs from './Breadcrumbs';
import TableData from './TableData';
import TableDiff from './TableDiff';

export default {
  name: 'table-page',
  components: {
    PageHeader,
    Breadcrumbs,
    TableData,
    TableDiff,
  },
  computed: {
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
    async createSnapshot() {
      try {
        await this.$store.dispatch('tables/snapshotTable', {
          schemaName: this.table.schema,
          tableName: this.table.name,
        });

        this.selectTabSnapshot();
        debugger; // eslint-disable-line
        if (this.table.snapshotError) {
          this.$snackbar.open({
            type: 'is-danger',
            message: 'Error creating snapshot',
          });
        } else {
          this.$snackbar.open('Snapshot created');
        }
      } catch (err) {
        this.$toast.open({
          message: err.message,
          position: 'bottom-right',
          type: 'is-danger',
        });
      }
    },
    async gotoDiff() {
      try {
        await this.$store.dispatch('tables/diffTable', {
          schemaName: this.table.schema,
          tableName: this.table.name,
        });
        this.$snackbar.open('Snapshot diffed');
        this.selectTabDiff();
      } catch (err) {
        this.$toast.open({
          message: err.message,
          position: 'bottom-right',
          type: 'is-danger',
        });
      }
    },
  },
};

</script>

<style>

</style>
