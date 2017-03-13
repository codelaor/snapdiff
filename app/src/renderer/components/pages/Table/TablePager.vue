<template>

  <span class="table-pager">
    <span />
    <!--<span>Page {{ table.currentPage }} of {{ Math.ceil(table.totalRows / table.recordsPerPage) }}</span>-->
    <span>
        <button @click="gotoPreviousPage">
          <icon name="chevron-left"/>
        </button>
        Page {{ table.currentPage }} of {{ Math.ceil(table.totalRows / table.rowsPerPage) }}
        <button @click="gotoNextPage">
          <icon name="chevron-right"/>
        </button>
    </span>
    <span>
      <label>Rows per page: </label>
      <input type="number" @change="onChangeRowsPerPage" v-model.number="table.rowsPerPage"/>
    </span>
  </span>
</template>

<script>

  export default {
    name: 'table-pager',
    computed: {
      table() {
        return this.$store.state.table;
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

  .table-pager {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

</style>
