<template>

  <span class="snapdiff-pager">
    <span />
    <span>Page {{ currentPage }} of {{ numberPages }}</span>
  </span>
</template>

<script>

  export default {
    name: 'snapdiff-pager',
    props: {
      totalRecords: {
        type: Number,
      },
      recordsPerPage: {
        type: Number,
        default: 10,
      },
      currentPage: {
        type: Number,
        default: 1,
      },
    },
    computed: {
      numberPages() {
        return Math.ceil(this.totalRecords / this.recordsPerPage);
      },
    },
  };

</script>

<style>

  .snapdiff-pager {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

</style>
