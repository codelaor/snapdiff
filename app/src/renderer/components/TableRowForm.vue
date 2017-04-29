<template>
  <b-table :data="row"
            :striped="true">
    <b-table-column field="key"
                    label="Field" />
    <b-table-column field="value"
                    label="Value" />
  </b-table>
</template>

<script>
  export default {
    name: 'table-row-form',
    computed: {
      table() {
        return this.$store.getters['tables/current'];
      },
      row() {
        const rowKey = this.$store.state.tables.current.rowKey;
        const fields = this.$store.state.tables.current.columns;
        const dbRow = this.table.rows
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
            entry.value = dbRow[field.name];
            return entry;
          });
      },
    },
    methods: {
    },
  };


</script>

<style>
</style>
