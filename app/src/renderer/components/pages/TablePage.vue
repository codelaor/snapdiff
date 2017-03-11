<template>
  <div class="header-page">
    <page-header v-bind:title="`Table '${ name}'`" v-bind:showBack="true"/>
    <div class="header-page-content-top">
      <table>
        <tr v-for="row in rows">
          <td>
            {{ row }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';

  export default {
    name: 'table-page',
    props: ['name'],
    created() {
      this.updateRows();
    },
    components: {
      PageHeader,
    },
    data() {
      return {
        limit: 25,
        offset: 0,
        rows: [],
      };
    },
    methods: {
      updateRows() {
        console.log("updateRows called"); // eslint-disable-line
        this.$store
          .dispatch('getTableContents', {
            table: this.name,
            limit: this.limit,
            offset: this.offset,
          })
          .then(results => {
            this.rows = results;
          });
      },
    },
  };

</script>

<style>

</style>
