<template>
  <span>
    <h1>Table row as form</h1>
    {{ row }}
  </span>
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
        return this.table.rows
          .find(row => {
            let matched = true;
            const unmatchedKey = this.table.primaryKeyFields
              .find(field => rowKey[field] !== row[field]);
            if (unmatchedKey) {
              matched = false;
            }
            return matched;
          });
      },
    },
    methods: {
    },
  };


</script>

<style>
</style>
