<template>
  <div class="container">
    <page-header :title="pageTitle" />
    <div class="column">
      <!--Toolbar-->
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
          <a class="level-item"
             @click="diffSnapshots"
             title="Re-diff current data against latest snapshots">
            <b-icon icon="compare" />
            <span>Re-diff snapshots</span>
          </a>
        </div>
        <div class="level-right">
        </div>
      </div>
      <!--Table-->
      <b-table :data="tables"
               v-if="tables.length"
               :selectable="false"
               :striped="true"
               :paginated="true"
               :per-page="12"
               :pagination-simple="true"
               :default-sort="['diffRowsChanged', 'desc']"
               render-html>
        <b-table-column field="schema"
                        label="Schema"
                        v-if="client.hasSchemas"
                        sortable/>
        <b-table-column field="name"
                        label="Name"
                        component="table-link-column"
                        sortable/>
        <b-table-column field="snapshotCreated"
                        label="Snapshot"
                        width="25"
                        component="snapshot-column"
                        sortable/>
        <b-table-column field="diffRowsChanged"
                        label="Diff"
                        component="diff-link-column"
                        width="25"
                        sortable/>
      </b-table>
  
      <p v-if="!tables.length">
        No tables with differences found in 'database' {{ databaseTitle }} (system tables are excluded.)
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
import PageHeader from './PageHeader';

export default {
  name: 'diffs-page',
  components: {
    PageHeader,
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
    pageTitle() {
      let pageTitle = `Database '${this.databaseTitle}'`;
      if (this.$route.name === 'diffs') {
        pageTitle = `${pageTitle} - Diffs`;
      }
      return pageTitle;
    },
    client() {
      return this.$store.getters['connection/client'];
    },
    tables() {
      return this.$store.state.tables.all
        .map(table =>
          Object.assign(table, {
            diffRowsChanged: table.diff ? table.diff.length : 0,
          }))
        .filter(table => table.diffRowsChanged > 0);
    },
  },
  methods: {
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
      this.$router.push({
        name: 'diffs',
      });
    },
  },
};

</script>

<style>

</style>
