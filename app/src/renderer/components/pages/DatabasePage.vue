<template>
  <div class="container">
    <page-header/>
    <div class="column">
      <!--Toolbar-->
      <div class="level">
        <div class="level-left">
          <a class="level-item"
             @click="createSnapshots"
             title="Create new snapshot for all tables">
            <b-icon icon="content_copy" /> Create snapshots
          </a>
          <a class="level-item"
             @click="diffSnapshots"
             title="Diff current data against latest snapshots">
            <b-icon icon="compare" /> Diff snapshots
          </a>
        </div>
        <div class="level-center">
          <span class="level-item">
                  Tables
            </span>
        </div>
        <div class="level-right">
        </div>
      </div>
      <!--Table-->
      <b-table :data="tables"
               v-if="tables.length"
               :selectable="true"
               :striped="true"
               :paginated="true"
               :per-page="12"
               :pagination-simple="true"
               @select="tableSelected"
               render-html>
        <b-table-column field="schema"
                        label="Schema"
                        v-if="client.hasSchemas" 
                        sortable/>
        <b-table-column field="name"
                        label="Name"                         
                        sortable/>
        <b-table-column field="snapshotCreated"
                        label="Snapshot"
                        :format="formatSnapshotState" 
                        sortable/>
        <b-table-column field="diffRowsChanged"
                        label="Diff" 
                        sortable/>
      </b-table>
  
      <p v-if="!tables.length">
        No tables found in 'database' {{ databaseTitle }} (system tables are excluded.)
      </p>
  
    </div>
    <div id="SnapshottingDialog"
         v-bind:class="{ modal: true, 'is-active': processing.tableCount > processing.tableIndex }">
      <div class="model-content">
        <div class="card">
          <div class="card-content">
            <p>{{ processing.task }} {{ processing.tableIndex }} of {{ processing.tableCount }}</p>
            <progress class="progress"
                      :value="processing.progressPercent"
                      max="100">{{ processing.progressPercent }}%</progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '../../formatters';
import PageHeader from './PageHeader';

export default {
  name: 'database-page',
  components: {
    PageHeader,
  },
  data() {
    return {
      connection: this.$store.state.connection,
      databaseTitle: this.$store.getters.databaseTitle,
      processing: {
        task: '',
        tableCount: 0,
        tableIndex: 0,
        progressPercent: 50,
      },
    };
  },
  computed: {
    client() {
      return this.$store.getters['connection/client'];
    },
    tables() {
      return this.$store.state.tables.all.map(table =>
        Object.assign(table, {
          diffRowsChanged: table.diff ? table.diff.length : null,
        }));
    },
  },
  methods: {
    formatSnapshotState(value, row) {
      let result;
      if (row.snapshotError) {
        result = '<span class="tag is-danger">Error</span>';
      } else {
        result = formatTime(value);
      }
      return result;
    },
    tableSelected(selectedTable) {
      this.$store
        .dispatch('tables/setCurrentTable', {
          schemaName: selectedTable.schema,
          tableName: selectedTable.name,
        })
        .then(() => {
          this.$router.push({
            name: 'table',
          });
        });
    },
    async createSnapshots() {
      this.processing.task = 'Creating snapshots';
      this.processing.tableIndex = 1;
      this.processing.tableCount = this.$store.state.tables.all.length;
      this.processing.progressPercent = 0;

      await Promise.all(this.$store.state.tables.all.map(async (table) => {
        const promise = this.$store.dispatch('tables/snapshotTable', {
          schemaName: table.schema,
          tableName: table.name,
        })
          .then(async () => {
            // Force refresh of showing which table we are up to
            this.processing.tableIndex++;
            this.processing.progressPercent = this.processing.tableIndex /
              this.processing.tableCount * 100;
            await this.$forceUpdate();
          });
        return promise;
      }))
        .catch((err) => {
          this.$toast.open({
            message: err.message,
            position: 'bottom-right',
            type: 'is-danger',
          });
        });
      this.$snackbar.open(`${this.processing.tableCount} snapshots created.`);
    },
    async diffSnapshots() {
      const tablesWithSnapshots = this.$store.state.tables.all
        .filter(table => (table.snapshotCreated));
      if (!tablesWithSnapshots.length) {
        this.$snackbar.open('No snapshots to diff');
        return;
      }
      this.processing.task = 'Diffing snapshots';
      this.processing.tableIndex = 1;
      this.processing.tableCount = tablesWithSnapshots.length;
      this.processing.progressPercent = 0;

      for (const table of tablesWithSnapshots) {
        await this.$store.dispatch('tables/diffTable', {
          schemaName: table.schema,
          tableName: table.name,
        })
          .catch((err) => {
            this.$toast.open({
              message: err.message,
              position: 'bottom-right',
              type: 'is-danger',
            });
          })
          .then(async () => {
            // Force refresh of showing which table we are up to
            this.processing.tableIndex++;
            this.processing.progressPercent = this.processing.tableIndex /
              this.processing.tableCount * 100;
            await this.$forceUpdate();
          });
      }

      this.$snackbar.open(`Diff of ${tablesWithSnapshots.length} table snapshots completed.`);
    },
  },
};

</script>

<style>

</style>
