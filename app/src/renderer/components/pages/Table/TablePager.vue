<template>

  <div class="nav">
    <div class="nav-left">
      <div class="nav-item">
        {{ table.totalRows }} rows 
      </div>
    </div>
    <div class="nav-center">
      <div class="nav-item">
        <a class="button is-small" @click="gotoPreviousPage" :disabled="table.currentPage < 2">
          <span class="icon is-small">
            <i class="fa fa-chevron-left"/>
          </span>
        </a>
        Page {{ table.currentPage }} of {{ pageCount }}
        <a class="button is-small" @click="gotoNextPage" :disabled="table.currentPage >= pageCount">
          <span class="icon is-small">
            <i class="fa fa-chevron-right"/>
          </span>
        </a>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-item">
        <label>Rows per page: </label>
        <input type="number" @change="onChangeRowsPerPage" v-model.number="table.rowsPerPage"/>
      </div>
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
