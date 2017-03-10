<template>
  <div class="header-page">
    <page-header v-bind:title="`Table '${ name}'`" v-bind:showBack="true"/>
    <div class="header-page-content-top">
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';

  export default {
    name: 'table-page',
    props: ['name'],
    components: {
      PageHeader,
    },
    data() {
      return {
        // tables: this.$store.state.tables,
      };
    },
    watch: {
    },
    methods: {
    },
  };

</script>

<style>

</style>
