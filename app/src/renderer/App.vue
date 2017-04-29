<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import store from './store';
  export default {
    store,
  };

</script>

<style>
@import '../../node_modules/material-design-icons/iconfont/material-icons.css';
td {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

div.scrollWrapper{
  overflow-x:auto;
  margin-bottom: 5px;
}

</style>
