<template>
  <b-table v-if="table.diff && table.diff.length"
           :selectable="true"
           @select="onSelect"
           :data="table.diff"
           :striped="true">
    <b-table-column field="snapdiffChange"
                    label="Change" />
    <b-table-column v-for="column in table.columns"
                    :field="column.name"
                    :label="column.name" />
  </b-table>
  <b-message has-icon v-else type="is-info" >
    No differences found between snapshot and current data
  </b-message>
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
  },
  data() {
    return {
    };
  },
  methods: {
    onSelect(row) {
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
