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

  .table-pager {
		width:100%; 
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 3px;
  }

  .table-pager-section {
    width: 33%;
  }

  .table-pager-left {
    display: flex;
    justify-content: flex-start;
  }

  .table-pager-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-pager-center > button {
    height: 1.8em;
    width: 1.8em;
  }

  .table-pager-center > * {
    margin-left: 5px;
    margin-right: 5px;
  }

  .table-pager-right {
    display: flex;
    justify-content: flex-end;
    margin-right: 5px;
  }

  .table-pager-right > input {
    margin-left: 5px;
    width: 4em;
    text-align: center;
    box-sizing: border-box;
  }

</style>
