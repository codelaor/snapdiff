<template>

  <span>Page {{ currentPage }} of {{ numberPages }}</span>

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
