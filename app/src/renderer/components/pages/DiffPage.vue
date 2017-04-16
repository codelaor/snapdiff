<template>
  <div class="container">
    <page-header/>
    <a v-on:click="$router.go(-1)">
      <span class="icon">
        <i class="fa fa-arrow-left"></i>
      </span>
    </a>
    <b-table :data="this.diff" :striped="true">
      <b-table-column field="snapdiffChange" label="Change"/>
      <b-table-column v-for="column in table.columns" :field="column.name" :label="column.name"/>
      <!--< v-for="diffRow in diff" :class="getDiffStyleClass(diffRow.snapdiffChange)">-->
        <!--<td class="diff-icon-cell">-->
          <!--<i :class="'fa fa-' + getDiffIcon(diffRow.snapdiffChange) "/>-->
        <!--</td>-->
        <!--<td>-->
          <!--{{ diffRow }}-->
        <!--</td>-->
      <!--</tr>-->

      <!--<tr v-if="!diff.length">-->
        <!--<td colspan="100%">-->
          <!--No difference between selected snapshots.-->
        <!--</td>-->
      <!--</tr>-->

    </b-table>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';
  import TablePager from './Table/TablePager';

  function doesKeyMatch(rec1, rec2, keyFields) {
    const differences = keyFields.filter((keyField) => {
      let bHasDifferences = false;
      if (rec1[keyField] !== rec2[keyField]) {
        if (rec1[keyField].valueOf() !== rec2[keyField].valueOf()) {
          bHasDifferences = true;
        }
      }
      return bHasDifferences;
    });
    return differences.length < 1;
  }

  export default {
    name: 'diff-page',
    props: ['schemaName', 'tableName'],
    created() {
      this.setTable();
    },
    components: {
      PageHeader,
      TablePager,
    },
    computed: {
      table() {
        return this.$store.getters.table;
      },
    },

    data() {
      return {
        diff: [],
      };
    },
    methods: {
      getDiffStyleClass(snapdiffChange) {
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
      getDiffIcon(snapdiffChange) {
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
        this.diff = [];
        const older = await this.$store.dispatch('getTableRows', {
          schemaName: this.schemaName,
          tableName: this.tableName,
          fromSnapshot: true,
          primaryKeyFields: this.table.primaryKeyFields,
        });
        const newer = await this.$store.dispatch('getTableRows', {
          schemaName: this.schemaName,
          tableName: this.tableName,
          fromSnapshot: false,
          primaryKeyFields: this.table.primaryKeyFields,
        });

        // Find removed records
        const removed = older.filter(olderRow => !newer.find(
          newerRow => doesKeyMatch(newerRow, olderRow, this.table.primaryKeyFields)))
          .map(removedRow => {
            removedRow.snapdiffChange = 'Removed';
            return removedRow;
          });

        // Find edited records
        const edited = newer.filter(newerRow => {
          const olderRow = older.find(
            row => doesKeyMatch(newerRow, row, this.table.primaryKeyFields)
          );
          if (!olderRow) {
            return false;
          }
          let diff = false;
          for (var prop in newerRow) { // eslint-disable-line
            if (olderRow[prop] !== newerRow[prop]) {
              if (olderRow[prop].valueOf() !== newerRow[prop].valueOf()) {
                diff = true;
                break;
              }
            }
          }
          return diff;
        }).map(editedRow => {
          editedRow.snapdiffChange = 'Edited';
          return editedRow;
        });

        // Find added/new records
        const added = newer.filter(newerRow => !older.find(
          olderRow => doesKeyMatch(newerRow, olderRow, this.table.primaryKeyFields)))
          .map(addedRow => {
            addedRow.snapdiffChange = 'Added';
            return addedRow;
          });
        this.diff = removed.concat(added).concat(edited);
      },
      getSnapshotData(snapshot) { // eslint-disable-line

      },
      handleSnapshotSelectLeft(snapshot) {
        this.leftSnapshot = snapshot;
        this.doDiff();
      },
      handleSnapshotSelectRight(snapshot) {
        this.rightSnapshot = snapshot;
        this.doDiff();
      },
      setTable() {
        this.$store
          .dispatch('setSelectedTable', {
            schemaName: this.schemaName,
            tableName: this.tableName,
          });
      },
    },
  };


</script>

<style>
</style>
