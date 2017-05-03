<template>
  <div class="container">
    <page-header/>

    <div class="column">
      <!--Content header / toolbar-->
      <div class="columns">
        <div class="column">
          <!--Breadcrumbs-->
          <breadcrumbs class="is-half" />
        </div>
        <div class="column is-narrow">
          <!--Toolbar-->
          <div class="level">
            <div class="level-right">
              <div class="level-item">
                <b-tooltip label="Refresh" position="is-bottom">
                  <a class="button" @click="refresh">
                    <b-icon icon="refresh" />
                  </a>
                </b-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <b-table :data="row"
               :striped="true">
        <b-table-column field="key"
                        label="Field" />
        <b-table-column field="dbValue"
                        :component="table.snapshotExists ? 'TableRowValueDiff' : 'TableRowValue'"
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
import Breadcrumbs from './Breadcrumbs';
import { formatTime } from '../formatters';

export default {
  name: 'table-row-page',
  components: {
    PageHeader,
    Breadcrumbs,
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
    table() {
      return this.$store.getters['tables/current'];
    },
  },
  methods: {
    formatTime,
    refresh() {
      this.$store.commit('tables/setCurrentRowKey', {
        key: this.table.rowKey,
      });
    },
  },
};

</script>

<style>
</style>
