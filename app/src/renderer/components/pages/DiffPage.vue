<template>
  <div class="header-page">
    <page-header v-bind:title="`Diff snapshots for table '${ table.schema ? table.schema + '.' : ''}${ table.name}'`" v-bind:showBack="true"/>
    <div class="header-page-content-top">
      <snapshot-select @select="handleSnapshotSelectLeft"/>
      <snapshot-select @select="handleSnapshotSelectRight"/>
      <table>
        <tr>
          <th>
            Diff row
          </th>
        </tr>

        <tr v-for="diffRow in diff">
          <td>
            {{ diffRow }}
          </td>
        </tr>

      </table>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';
  import TablePager from './Table/TablePager';
  import SnapshotSelect from '../shared/SnapshotSelect';
  import { diff as deepDiff } from 'deep-diff';

  export default {
    name: 'diff-page',
    props: ['schemaName', 'tableName'],
    created() {
      this.setTable();
    },
    components: {
      PageHeader,
      TablePager,
      SnapshotSelect,
    },
    computed: {
      table() {
        return this.$store.state.table;
      },
    },
    data() {
      return {
        leftSnapshot: '',
        rightSnapshot: '',
        diff: '',
      };
    },
    watch: {
      limit() {
        this.getData();
      },
    },
    methods: {
      async doDiff() {
        this.diff = '';
        const lhs = await this.$store.dispatch('getTableRows', {
          schemaName: this.schemaName,
          tableName: this.tableName,
          snapshotId: this.leftSnapshot,
        });
        const rhs = await this.$store.dispatch('getTableRows', {
          schemaName: this.schemaName,
          tableName: this.tableName,
          snapshotId: this.rightSnapshot,
        });
        this.diff = deepDiff(lhs, rhs);
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
          .dispatch('setTable', {
            schemaName: this.schemaName,
            tableName: this.tableName,
          });
      },
    },
  };

</script>

<style>

</style>
