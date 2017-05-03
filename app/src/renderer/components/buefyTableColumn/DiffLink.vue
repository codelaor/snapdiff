// Custom component for displaying table diff info with drill down 
// refer https://buefy.github.io/#/documentation/table
<template>
  <a @click.stop="onClick">
    {{ data }}
  </a>
</template>

<script>
export default {
  name: 'diff-link',
  props: ['data', 'row'], // beufy table props
  methods: {
    async onClick() {
      await this.$store.dispatch('tables/setCurrentTable', {
        schemaName: this.row.schema,
        tableName: this.row.name,
      });
      this.$store.commit('pages/setTableActiveTab', 'Diff');
      this.$router.push({ name: 'table' });
    },
  },
};
</script>
