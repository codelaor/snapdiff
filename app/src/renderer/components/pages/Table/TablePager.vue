<template>

  <span class="table-pager">
    <span />
    <span>Page {{ table.currentPage }} of {{ numberPages }}</span>
    <span>
      <label>Rows per page: </label>
      <input type="number" v-model.number="table.rowsPerPage"/>
    </span>
  </span>
</template>

<script>

  export default {
    name: 'table-pager',
    computed: {
      numberPages() {
        return Math.ceil(this.totalRecords / this.recordsPerPage);
      },
      table() {
        return this.$store.state.table;
      },
    },
  };

</script>

<style>

  .table-pager {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

</style>
