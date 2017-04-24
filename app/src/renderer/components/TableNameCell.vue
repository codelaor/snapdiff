<template>
  <a @click="onClick">
    {{ data }}
  </a>
</template>

<script>
export default {
  name: 'table-name-cell',
  props: ['data', 'row'],
  methods: {
    onClick() {
      this.$store
        .dispatch('tables/setCurrentTable', {
          schemaName: this.row.schema,
          tableName: this.row.name,
        })
        .then(() => {
          this.$router.push({
            name: 'table',
          });
        });
    },
  },
};
</script>
