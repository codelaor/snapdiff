<template>
  <div>
    <!--Table-->
    <div class="scrollWrapper">
      <b-table v-if="table.rows.length"
               :data="table.rows"
               :selectable="true"
               @select="onRowSelect"
               :striped="true">
        <!--Table Header-->
        <b-table-column v-for="column in table.columns"
                        :field="column.name"
                        :label="column.name" />
      </b-table>
    </div>
  
    <!--Pager-->
    <b-pagination v-if="table.rows.length"
                  class="is-pulled-right"
                  :total="table.totalRows"
                  :current="table.page"
                  :per-page="10"
                  :simple="true"
                  @change="pageChanged">
    </b-pagination>
  
    <div v-if="!table.rows.length"
         class="notification is-info">
      No data found.
    </div>
  </div>
</template>

<script>
export default {
  name: 'table-page',
  computed: {
    table() {
      return this.$store.getters['tables/current'];
    },
  },
  methods: {
    onRowSelect(row) {
      const key = {};
      this.table.primaryKeyFields.forEach(field => {
        key[field] = row[field];
      });
      this.$store.commit('tables/setCurrentRowKey', {
        key,
      });
      this.$router.push({
        name: 'row',
      });
    },
    pageChanged(value) {
      this.$store.dispatch('tables/setCurrentPage', value);
    },
    refresh() {
      this.$store.dispatch('tables/setCurrentRows')
        .then(() => {
          this.$snackbar.open('Data refreshed');
        });
    },
  },
};

</script>

<style>

</style>
