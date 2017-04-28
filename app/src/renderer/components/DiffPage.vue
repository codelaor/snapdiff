<template>
  <div class="container">
    <page-header :title="pageTitle"/>
    <div class="column">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <a v-on:click="$router.go(-1)">
              <b-icon icon="arrow_back"/>
            </a>
          </div>
        </div>
      </div>
      <b-table v-if="table.diff.length" :data="table.diff" :striped="true">
        <b-table-column field="snapdiffChange" label="Change"/>
        <b-table-column v-for="column in table.columns" :field="column.name" :label="column.name"/>
      </b-table>
      <div v-if="!table.diff.length" class="notification is-primary">
        No differences found between snapshot and current data
      </div>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';

  export default {
    name: 'diff-page',
    components: {
      PageHeader,
    },
    computed: {
      table() {
        return this.$store.getters['tables/current'];
      },
      pageTitle() {
        return `Table '${this.table.name}' Diff`;
      },
    },
    data() {
      return {
      };
    },
    methods: {
      getTableDiffStyleClass(snapdiffChange) {
        const styles = [];
        switch (snapdiffChange) {
          case 'Added':
            styles.push('diff-added');
            break;
          case 'Edited':
            styles.push('diff-edited');
            break;
          case 'Removed':
            styles.push('diff-removed');
            break;
          default:
        }
        return styles;
      },
      getTableDiffIcon(snapdiffChange) {
        let icon;
        switch (snapdiffChange) {
          case 'Added':
            icon = 'plus-square-o';
            break;
          case 'Edited':
            icon = 'pencil-square-o';
            break;
          case 'Removed':
            icon = 'minus-square-o';
            break;
          default:
            icon = 'question-circle-o';
        }
        return icon;
      },
      async doDiff() {
        this.$store.dispatch('diffTable', {
          schemaName: this.schemaName,
          tableName: this.tableName,
        });
      },
      handleSnapshotSelectLeft(snapshot) {
        this.leftSnapshot = snapshot;
        this.doDiff();
      },
      handleSnapshotSelectRight(snapshot) {
        this.rightSnapshot = snapshot;
        this.doDiff();
      },
    },
  };


</script>

<style>
</style>
