// Custom component for displaying table name with drill down 
// refer https://buefy.github.io/#/documentation/table
<template>
  <a @click="onClick">
    {{ data }}
  </a>
</template>

<script>
export default {
  name: 'table-link-column',
  props: ['data', 'row'], // beufy table props
  methods: {
    async onClick() {
      await this.$store.dispatch('tables/setCurrentTable', {
        schemaName: this.row.schema,
        tableName: this.row.name,
      });
      await this.$store.dispatch('tables/setCurrentShowSnapshot', {
        showSnapshot: false,
      });
      this.$router.push({
        name: 'table',
      });
    },
  },
};
</script>
