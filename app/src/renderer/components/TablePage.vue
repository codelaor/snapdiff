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
        <div class="level-right">
          <div class="level-item">
            <b-tooltip label="Show current data or snapshot"
                       position="is-bottom">
              <b-radio-group :value="table.showSnapshot"
                             @change="selectShowSnapshot">
                <b-radio :value="false">Current</b-radio>
                <b-radio :value="true"
                         :disabled="!table.snapshotCreated">Snapshot</b-radio>
              </b-radio-group>
            </b-tooltip>
          </div>
          <div class="level-item">
            <b-tooltip label="Refresh current data"
                       position="is-bottom">
              <a class="button"
                 :disabled="table.showSnapshot"
                 @click="refresh">
                <b-icon icon="refresh" />
              </a>
            </b-tooltip>
            <b-tooltip label="Create / update snapshot"
                       position="is-bottom">
              <a class="button"
                 @click="createSnapshot">
                <b-icon icon="content_copy" />
              </a>
            </b-tooltip>
            <b-tooltip label="Diff snapshot"
                       position="is-bottom">
              <a class="button"
                 @click="gotoDiff"
                 :disabled="!table.snapshotCreated">
                <b-icon icon="compare" />
              </a>
            </b-tooltip>
          </div>
        </div>
      </div>
    </div>
  
    <!--Table-->
    <div class="scrollWrapper">
      <b-table v-if="table.rows.length"
               :data="table.rows"
               :striped="true">
        <!--Table Header-->
        <b-table-column v-for="column in table.columns"
                        :field="column.name"
                        :label="column.name" />
        <!--<i v-if="table.primaryKeyFields.includes(column.name)" class="fa fa-key"/> {{ column.name }}-->
  
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
import { formatTime } from '../formatters';
import PageHeader from './PageHeader';

export default {
  name: 'table-page',
  components: {
    PageHeader,
  },
  computed: {
    pageTitle() {
      let title = `Table '${this.table.name}'`;
      if (this.table.showSnapshot) {
        title = `${title} (Snapshot @ ${formatTime(this.table.snapshotCreated)})`;
      }
      return title;
    },
    table() {
      return this.$store.getters['tables/current'];
    },
  },
  watch: {
    limit() {
      this.getData();
    },
  },
  methods: {
    formatTime,
    pageChanged(value) {
      this.$store.dispatch('tables/setCurrentPage', value);
    },
    refresh() {
      this.$store.dispatch('tables/setCurrentRows')
        .then(() => {
          this.$snackbar.open('Data refreshed');
        });
    },
    createSnapshot() {
      this.$store.dispatch('tables/snapshotTable', {
        schemaName: this.table.schema,
        tableName: this.table.name,
      })
        .then(() => {
          this.$snackbar.open('Snapshot created');
        })
        .catch((err) => {
          this.$toast.open({
            message: err.message,
            position: 'bottom-right',
            type: 'is-danger',
          });
        });
    },
    gotoDiff() {
      this.$store.dispatch('tables/diffTable', {
        schemaName: this.table.schema,
        tableName: this.table.name,
      })
        .then(() => {
          this.$router.push({
            name: 'diff',
          });
        })
        .catch((err) => {
          this.$toast.open({
            message: err.message,
            position: 'bottom-right',
            type: 'is-danger',
          });
        });
    },
    selectShowSnapshot(showSnapshot) {
      this.$store
        .dispatch('tables/setCurrentShowSnapshot', {
          showSnapshot,
        });
    },
  },
};

</script>

<style>

</style>
