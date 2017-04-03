<template>
  <div>
    Snapshot:
    <select :value="table.snapshot" @input="handleSnapshotSelect">
      <option value="">Current data</option>
      <option value disabled>—————————————</option>
      <option v-if="!table.snapshots.length" value disabled>No snapshots found</option>
      <option v-for="snapshot in table.snapshots" :value="snapshot.created">{{ snapshot.created.toTimeString() }}</option>
    </select>
  </div>
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
      handleSnapshotSelect(event) {
        this.$emit('select', event.target.value);
      },
    },
  };

</script>

<style>

</style>
