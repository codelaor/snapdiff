<template>
    <p class="control">
      <span class="select is-small">
        <select :value="table.snapshot" @input="handleSnapshotSelect">
          <option value="">Current data</option>
          <option value disabled>—————————————</option>
          <option v-if="!table.snapshots.length" value disabled>No snapshots found</option>
          <option v-for="snapshot in table.snapshots" :value="snapshot.created">Snapshot @{{ formatTime(snapshot.created) }}</option>
        </select>
      </span>
    </p>
</template>

<script>
  export default {
    name: 'snapshot-select',
    computed: {
      table() {
        return this.$store.state.table;
      },
    },
    data() {
      return {
      };
    },
    methods: {
      formatTime(time) {
        // Return time exlcuding GMT/Timezone data
        const timeString = time.toTimeString();
        return timeString.substr(0, timeString.indexOf(' '));
      },
      handleSnapshotSelect(event) {
        this.$emit('select', event.target.value);
      },
    },
  };

</script>

<style>

</style>
