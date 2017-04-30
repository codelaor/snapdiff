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
                render-html
               :striped="true">
        <b-table-column field="key"
                        label="Field" />
        <b-table-column field="dbValue"
                        :format="formatDbValue"
                        :label="table.snapshotCreated ? `Current Value` : 'Value'" />
        <b-table-column field="snapshotValue"
                        :format="formatSnapshotValue"
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
  computed: {
    pageTitle() {
      const title = `Table '${this.$store.getters['tables/current'].name}' Row`;
      return title;
    },
    table() {
      return this.$store.getters['tables/current'];
    },
    row() {
      return this.$store.getters['tables/currentRow'];
    },
  },
  methods: {
    formatTime,
    formatSnapshotValue(value, row) {
      let retValue = value;
      if (this.table.snapshotCreated && (value.valueOf() !== row.dbValue.valueOf())) {
        retValue = `<span class="removed">${value}</span>`;
      }
      return retValue;
    },
    formatDbValue(value, row) {
      let retValue = value;
      if (this.table.snapshotCreated && (value.valueOf() !== row.snapshotValue.valueOf())) {
        retValue = `<span class="added">${value}</span>`;
      }
      return retValue;
    },
  },
};

</script>

<style>
  .added {
    background-color: lightgreen;
    padding: 5px;
  }
  .removed {
    background-color: palevioletred;
    color: white;
    padding: 5px;
  }
</style>
