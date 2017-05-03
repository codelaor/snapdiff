<template>
  <div class="container">
    <page-header/>
  
    <div class="column">
      <!--Content header / toolbar-->
      <div class="columns">
        <div class="column">
          <!--Breadcrumbs-->
          <breadcrumbs class="is-half" />
        </div>
        <div class="column is-narrow">
          <!--Toolbar-->
          <div class="level">
            <div class="level-right">
              <a class="level-item" @click="createSnapshots" title="Create new snapshot for all tables">
                <b-icon icon="archive" />
                <span v-if="snapshotsExist">Recreate snapshots</span>
                <span v-else>Create snapshots</span>
              </a>
              <a class="level-item" v-if="snapshotsExist" @click="diffSnapshots" title="Diff current data against latest snapshots">
                <b-icon icon="compare" />
                <span>Diff snapshots</span>
              </a>
            </div>
          </div>
        </div>
      </div>
  
      <!--Tabs-->
      <div class="tabs is-boxed">
        <ul>
          <li :class="{ 'is-active': activeTab === 'Tables' }"><a @click="selectTabTables">Tables</a></li>
          <li :class="{ 'is-active': activeTab === 'Diffs' }"><a @click="selectTabDiffs">Diffs</a></li>
        </ul>
      </div>
  
      <!--Tab content-->
      <database-tables v-if="activeTab === 'Tables'" />
      <database-diffs v-if="activeTab === 'Diffs'" />
  
    </div>
    <div id="SnapshottingDialog" v-bind:class="{ modal: true, 'is-active': processing.tableCount > processing.tableIndex }">
      <div class="model-content">
        <div class="card">
          <div class="card-content">
            <p>{{ processing.task }} {{ processing.tableIndex }} of {{ processing.tableCount }}</p>
            <progress class="progress" :value="processing.progressPercent" max="100">{{ processing.progressPercent }}%</progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from './PageHeader';
import Breadcrumbs from './Breadcrumbs';
import DatabaseTables from './DatabaseTables';
import DatabaseDiffs from './DatabaseDiffs';

export default {
  name: 'database-page',
  components: {
    PageHeader,
    Breadcrumbs,
    DatabaseTables,
    DatabaseDiffs,
  },
  data() {
    return {
      connection: this.$store.state.connection,
      databaseTitle: this.$store.getters['connection/databaseTitle'],
      processing: {
        task: '',
        tableCount: 0,
        tableIndex: 0,
        progressPercent: 50,
      },
    };
  },
  computed: {
    activeTab() {
      return this.$store.state.pages.database.activeTab;
    },
    snapshotsExist() {
      return this.$store.state.tables.snapshotsExist;
    },
    client() {
      return this.$store.getters['connection/client'];
    },
    tables() {
      return this.$store.state.tables.all;
    },
  },
  methods: {
    selectTabDiffs() {
      this.$store.commit('pages/setDatabaseActiveTab', 'Diffs');
    },
    selectTabTables() {
      this.$store.commit('pages/setDatabaseActiveTab', 'Tables');
    },
    async onSelect(row) {
      await this.$store.dispatch('tables/setCurrentTable', {
        schemaName: row.schema,
        tableName: row.name,
      });
      await this.$store.dispatch('tables/setCurrentShowSnapshot', {
        showSnapshot: false,
      });
      this.$router.push({
        name: 'table',
      });
    },
    async createSnapshots() {
      this.selectTabTables();
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
          this.$snackbar.open({
            message: err.message,
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
            this.$snackbar.open({
              message: err.message,
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
      this.selectTabDiffs();
    },
  },
};

</script>

<style>

</style>
