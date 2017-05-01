// Custom component for displaying table row value with drill down 
// refer https://buefy.github.io/#/documentation/table
<template>
  <span v-if="data" @click.stop="onClick">
    {{ data }}
  </span>
</template>

<script>
export default {
  name: 'table-row-value',
  props: ['data', 'row'], // beufy table props
  methods: {
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
</style>
