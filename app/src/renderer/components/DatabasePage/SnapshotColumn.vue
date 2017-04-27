// Custom component for displaying table name with drill down 
// refer https://buefy.github.io/#/documentation/table
<template>
  <span v-if="row.snapshotError"
        class="tag is-danger">Error</span>
  <a v-else
     @click="onClick">
      {{formatTime(data)}}
    </a>
</template>

<script>
import { formatTime } from '../../formatters';
export default {
  name: 'snapshot-column',
  props: ['data', 'row'], // beufy table props
  methods: {
    formatTime,
    async onClick() {
      await this.$store.dispatch('tables/setCurrentTable', {
        schemaName: this.row.schema,
        tableName: this.row.name,
      });
      await this.$store.dispatch('tables/setCurrentShowSnapshot', {
        showSnapshot: true,
      });
      this.$router.push({
        name: 'table',
      });
    },
  },
};
</script>
