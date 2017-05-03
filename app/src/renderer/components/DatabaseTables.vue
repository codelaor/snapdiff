<template>
  <!--Table-->
  <b-table :data="tables"
            v-if="tables.length"
            :selectable="true"
            :striped="true"
            :paginated="true"
            :per-page="12"
            :pagination-simple="true"
            :default-sort="['name', 'asc']"
            @select="onSelect"
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
                    v-if="snapshotsExist"
                    width="25"
                    component="snapshot-link"
                    sortable/>
  </b-table>

  <b-message v-else
            title="No tables"
            has-icon
            type="is-info"
            v-else>
    No tables found in database (system tables are excluded.)
  </b-message>
</template>

<script>

export default {
  name: 'database-tables',
  computed: {
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
    async onSelect(row) {
      await this.$store.dispatch('tables/setCurrentTable', {
        schemaName: row.schema,
        tableName: row.name,
      });
      this.$store.commit('pages/setTableActiveTab', 'Current');
      this.$router.push({
        name: 'table',
      });
    },
  },
};

</script>

<style>

</style>
