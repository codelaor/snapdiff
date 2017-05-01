// Custom component for displaying table name with drill down 
// refer https://buefy.github.io/#/documentation/table
<template>
  <span v-if="data" @click.stop="onClick" v-bind:class="{ removed: changeType === 'Removed', added: changeType === 'Added' }" >
        {{ data }}
  </span>
</template>

<script>
import { formatTime } from '../formatters';
export default {
  name: 'snapshot-column',
  props: ['data', 'row'], // beufy table props
  computed: {
    changeType() {
      const thisValue = this.data ? this.data.valueOf() : null;
      const dbValue = this.row.dbValue ? this.row.dbValue.valueOf() : null;
      const snapshotValue = this.row.snapshotValue ? this.row.snapshotValue.valueOf() : null;

      let changeType;
      if (thisValue === snapshotValue && thisValue !== dbValue) {
        changeType = 'Removed';
      } else if (thisValue === dbValue && thisValue !== snapshotValue) {
        changeType = 'Added';
      }

      return changeType;
    },
  },
  methods: {
    formatTime,
    onClick() {
      this.$dialog.alert({
        title: 'Field value',
        message: this.data,
      });
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
