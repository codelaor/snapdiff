<template>
  <div class="container">
    <page-header/>
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
      <b-table :data="table.diff" :striped="true">
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
      <p v-if="!this.diff.length">No differences found between snapshot and current data</p>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';

  export default {
    name: 'diff-page',
    props: ['schemaName', 'tableName'],
    created() {
      this.setTable();
    },
    components: {
      PageHeader,
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
        this.$store.dispatch('diffTable', {
          schemaName: this.schemaName,
          tableName: this.tableName,
        });
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
          })
          .then(() => {
            this.doDiff();
          });
      },
    },
  };


</script>

<style>
</style>
