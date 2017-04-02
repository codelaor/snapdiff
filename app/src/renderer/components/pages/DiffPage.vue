<template>
  <div class="header-page">
    <page-header v-bind:title="`Diff snapshots for table '${ table.schema ? table.schema + '.' : ''}${ table.name}'`" v-bind:showBack="true"/>
    <div class="header-page-content-top">
      <p>Diff results coming soon</p>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';
  import TablePager from './Table/TablePager';

  export default {
    name: 'diff-page',
    props: ['schemaName', 'tableName'],
    created() {
      this.setTable();
    },
    components: {
      PageHeader,
      TablePager,
    },
    computed: {
      table() {
        return this.$store.state.table;
      },
    },
    data() {
      return {
        limit: 2,
        offset: 0,
        totalRows: 55,
        currentPage: 1,
      };
    },
    watch: {
      limit() {
        this.getData();
      },
    },
    methods: {
      setTable() {
        this.$store
          .dispatch('setTable', {
            schemaName: this.schemaName,
            tableName: this.tableName,
          });
      },
    },
  };

</script>

<style>

</style>
