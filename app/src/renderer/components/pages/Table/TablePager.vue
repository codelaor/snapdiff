<template>

  <div class="table-pager">
    <div class="table-pager-section table-pager-left">
      {{ table.totalRows }} rows 
    </div>
    <div class="table-pager-section table-pager-center">
        <button @click="gotoPreviousPage" :disabled="table.currentPage < 2">
          <icon name="chevron-left"/>
        </button>
        Page {{ table.currentPage }} of {{ pageCount }}
        <button @click="gotoNextPage" :disabled="table.currentPage >= pageCount">
          <icon name="chevron-right"/>
        </button>
    </div>
    <div class="table-pager-section table-pager-right">
      <label>Rows per page: </label>
      <input type="number" @change="onChangeRowsPerPage" v-model.number="table.rowsPerPage"/>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'table-pager',
    computed: {
      table() {
        return this.$store.state.table;
      },
      pageCount() {
        return this.$store.getters.tablePageCount;
      },
    },
    methods: {
      gotoNextPage() {
        this.$store.dispatch('setTableCurrentPage', this.table.currentPage + 1);
      },
      gotoPreviousPage() {
        this.$store.dispatch('setTableCurrentPage', this.table.currentPage - 1);
      },
      onChangeRowsPerPage(event) {
        this.$store.dispatch('setTableRowsPerPage', Number(event.target.value));
      },
    },
  };

</script>

<style>

</style>
