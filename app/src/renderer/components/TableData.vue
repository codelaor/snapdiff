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
  
    <b-message has-icon v-if="showSnapshot && !table.snapshotCreated" type="is-info" >
      No snapshot exists.
    </b-message>
    <span v-else> 
      <b-message has-icon v-if="!table.rows.length" type="is-info" >
          No data.
      </b-message>
    </span>

    </div>
  </div>
</template>

<script>
export default {
  name: 'table-page',
  computed: {
    showSnapshot() {
      return this.$store.state.tables.current.showSnapshot;
    },
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
