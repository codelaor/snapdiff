// Custom component for displaying table name with drill down 
// refer https://buefy.github.io/#/documentation/table
<template>
  <a @click="onClick">
    {{ data }}
  </a>
</template>

<script>
export default {
  name: 'diff-link-column',
  props: ['data', 'row'], // beufy table props
  methods: {
    async onClick() {
      await this.$store.dispatch('tables/setCurrentTable', {
        schemaName: this.row.schema,
        tableName: this.row.name,
      });
      this.$router.push({
        name: 'diff',
      });
    },
  },
};
</script>
