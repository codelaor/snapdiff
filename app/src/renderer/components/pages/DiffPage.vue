<template>
  <div class="header-page">
    <page-header v-bind:title="`Diff snapshots for table '${ table.schema ? table.schema + '.' : ''}${ table.name}'`" v-bind:showBack="true"/>
    <div class="header-page-content-top">
      <snapshot-select @select="handleSnapshotSelectLeft"/>
      <snapshot-select @select="handleSnapshotSelectRight"/>
      Left: {{ leftSnapshot }}
      Right: {{ rightSnapshot }}
      <p>{{ diff }}</p>
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
      doDiff() {
        this.diff = '';
        const lhs = {
          hello: 'World',
        };
        const rhs = {
          hello: ', World!',
        };
        this.diff = deepDiff(lhs, rhs);
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
