<template>
  <b-table :data="row"
            :striped="true">
    <b-table-column field="key"
                    label="Field" />
    <b-table-column field="dbValue"
                    :label="table.snapshotCreated ? `Current Value` : 'Value'"/>
    <b-table-column v-if="table.snapshotCreated"
                    field="snapshotValue"
                    :label="`@ ${formatTime(table.snapshotCreated)}`"/>
  </b-table>
</template>

<script>
  import { formatTime } from '../formatters';

  export default {
    name: 'table-row-form',
    computed: {
      table() {
        return this.$store.getters['tables/current'];
      },
      row() {
        const rowKey = this.$store.state.tables.current.rowKey; // TODO get this from this.tables
        const fields = this.table.columns;
        const dbRow = this.table.rows // TODO fix. Only works if showSnapshot is set to false
          .find(row => {
            let matched = true;
            const unmatchedKey = this.table.primaryKeyFields
              .find(field => rowKey[field] !== row[field]);
            if (unmatchedKey) {
              matched = false;
            }
            return matched;
          });
        const snapshotRow = !this.table.snapshotCreated ? {} : this.table.snapshot
          .find(row => {
            let matched = true;
            const unmatchedKey = this.table.primaryKeyFields
              .find(field => rowKey[field] !== row[field]);
            if (unmatchedKey) {
              matched = false;
            }
            return matched;
          });
        return fields
          .map(field => {
            const entry = {};
            entry.key = field.name;
            entry.dbValue = dbRow[field.name];
            entry.snapshotValue = snapshotRow[field.name];
            return entry;
          });
      },
    },
    methods: {
      formatTime,
    },
  };


</script>

<style>
</style>
