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
            <b-icon icon="content_copy"/>
             Create snapshots
          </a>
          <a class="level-item"
             @click="diffSnapshots"
             title="Diff current data against latest snapshots">
            <b-icon icon="compare"/>
             Diff snapshots
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
               @select="tableSelected">
        <b-table-column field="schema"
                        label="Schema"
                        v-if="client.hasSchemas" />
        <b-table-column field="name"
                        label="Name" />
        <b-table-column field="snapshotCreated"
                        label="Snapshot"
                        :format="formatTime" />
        <b-table-column field="diffRowsChanged"
                        label="Diff" />
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
      return this.$store.getters.connectionClient;
    },
    tables() {
      return this.$store.state.tables;
    },
  },
  methods: {
    formatTime,
    tableSelected(selectedTable) {
      this.$router.push({
        name: 'schemaTable', params: {
          schemaName: selectedTable.schema,
          tableName: selectedTable.name,
        },
      });
    },
    async createSnapshots() {
      this.processing.task = 'Creating snapshots';
      this.processing.tableIndex = 1;
      this.processing.tableCount = this.$store.state.tables.length;
      this.processing.progressPercent = 0;

      await Promise.all(this.$store.state.tables.map(async (table) => {
        const promise = this.$store.dispatch('snapshotTable', {
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
      const tablesWithSnapshots = this.$store.state.tables
        .filter(table => (table.snapshotCreated));
      if (!tablesWithSnapshots.length) {
        this.$snackbar.open('No snapshots to diff');
        return;
      }
      this.processing.task = 'Diffing snapshots';
      this.processing.tableIndex = 1;
      this.processing.tableCount = tablesWithSnapshots.length;
      this.processing.progressPercent = 0;

      await Promise.all(tablesWithSnapshots.map(async (table) => {
        const promise = this.$store.dispatch('snapshotTable', {
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
      this.$snackbar.open(`Diff of ${tablesWithSnapshots.length} table snapshots completed.`);
    },
  },
};

</script>

<style>

</style>
