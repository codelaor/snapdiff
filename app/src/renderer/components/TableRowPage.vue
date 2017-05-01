<template>
  <div class="container">
    <page-header :title="pageTitle" />
    <div class="column">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <b-tooltip label="Go back"
                       position="is-bottom">
              <a v-on:click="$router.go(-1)">
                <b-icon icon="arrow_back" />
              </a>
            </b-tooltip>
          </div>
        </div>
      </div>
  
      <b-table :data="row"
               :striped="true">
        <b-table-column field="key"
                        label="Field" />
        <b-table-column field="dbValue"
                        :component="table.snapshotExists ? 'TableRowValueDiff' : null"
                        :label="table.snapshotCreated ? `Current Value` : 'Value'" />
        <b-table-column field="snapshotValue"
                        component="TableRowValueDiff"
                        v-if="table.snapshotCreated"
                        :label="`@ ${ formatTime(table.snapshotCreated) }`" />
      </b-table>
    </div>
  
  </div>
</template>

<script>
import PageHeader from './PageHeader';
import { formatTime } from '../formatters';

export default {
  name: 'table-row-page',
  components: {
    PageHeader,
  },
  created() {
    this.$store.dispatch('tables/getCurrentRow')
      .then(result => {
        this.row = result;
      });
  },
  data() {
    return {
      row: [],
    };
  },
  computed: {
    pageTitle() {
      const title = `Table '${this.$store.getters['tables/current'].name}' Row`;
      return title;
    },
    table() {
      return this.$store.getters['tables/current'];
    },
  },
  methods: {
    formatTime,
  },
};

</script>

<style>
</style>
