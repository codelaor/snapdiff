<template>

  <div class="level">
    <div class="level-left">
      <div class="level-item">
        {{ table.totalRows }} rows 
      </div>
    </div>
    <div class="level-center">
      <div class="level-item">
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
    <div class="level-right">
      <div class="level-item">
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
        return this.$store.getters.table;
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
