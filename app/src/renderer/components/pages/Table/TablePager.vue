<template>

  <div class="table-pager">
    <div class="table-pager-section table-pager-left">
      {{ table.totalRows }} rows 
    </div>
    <div class="table-pager-section table-pager-center">
        <a class="button" @click="gotoPreviousPage" :disabled="table.currentPage < 2">
          <span class="icon">
            <i class="fa fa-chevron-left"/>
          </span>
        </a>
        Page {{ table.currentPage }} of {{ pageCount }}
        <a class="button" @click="gotoNextPage" :disabled="table.currentPage >= pageCount">
          <span class="icon">
            <i class="fa fa-chevron-right"/>
          </span>
        </a>
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
