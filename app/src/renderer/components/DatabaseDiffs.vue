<template>
      <!--Table-->
      <b-table :data="tables"
               v-if="tables.length"
               :selectable="true"
               :striped="true"
               :paginated="true"
               :per-page="12"
               :pagination-simple="true"
               :default-sort="['diffRowsChanged', 'desc']"
               render-html
               @select="onRowSelect">
        <b-table-column field="schema"
                        label="Schema"
                        v-if="client.hasSchemas"
                        sortable/>
        <b-table-column field="name"
                        label="Name"
                        sortable/>
        <b-table-column field="snapshotCreated"
                        label="Snapshot"
                        width="25"
                        component="snapshot-link"
                        sortable/>
        <b-table-column field="diffRowsChanged"
                        label="Diff"
                        component="diff-link"
                        width="25"
                        sortable/>
      </b-table>
  
      <span v-else>
        <!--Message if snapshots don't exist-->
        <b-message has-icon
                  type="is-info"
                  v-if="!snapshotsExist">
          Click 'Create snapshots' to snapshot all tables. These snapshots can then be diffed to look for changes.
        </b-message>

        <!--Message if no diffs-->
        <b-message 
                  has-icon
                  type="is-info"
                  v-else>
          No differences found. Click 'Diff snapshots' to check / re-check difference between current data and snapshots.
        </b-message>
      </span>
  
    </div>
  </div>
</template>

<script>

export default {
  name: 'database-diffs',
  computed: {
    snapshotsExist() {
      return this.$store.state.tables.snapshotsExist;
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
    async onRowSelect(row) {
      try {
        await this.$store.dispatch('tables/setCurrentTable', {
          schemaName: row.schema,
          tableName: row.name,
        });
        this.$store.commit('pages/setTableActiveTab', 'Diff');
        this.$router.push({ name: 'table' });
      } catch (err) {
        this.$snackbar.open({
          message: err.message,
          type: 'is-danger',
        });
      }
    },
  },
};

</script>

<style>

</style>
