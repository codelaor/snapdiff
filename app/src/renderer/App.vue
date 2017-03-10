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
  @import url(https://fonts.googleapis.com/css?family=Lato:300);
  html,
  body {
    height: 100%;
    margin: 0;
    font-family: Lato, Helvetica, sans-serif;
  }
  
  #app {
    height: 100%;
  }
  /* Page with header */
  
  .header-page {
    height: 100%;
    position: relative;
  }
  /* Header section */
  
  .header-page-header {
    height: 50px;
    padding: 10px;
    display: flex;
    align-items: center;
    position: absolute;
    justify-content: space-between;
    width: 100%;
    top: 0;
    left: 0;
  }
  
  .header-page-header,
  .header-page-content-top,
  .header-page-content-centered {
    -webkit-box-sizing: border-box;
    /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;
    /* Firefox, other Gecko */
    box-sizing: border-box;
    /* Opera/IE 8+ */
    padding: 10px;
  }
  
  .header-page-content-top {
    width: 100%;
    position: absolute;
    top: 50px;
    left: 0;
    z-index: 10;
  }
  
  .header-page-content-centered {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
  }
  
  .fa-icon {
    width: auto;
    height: 1em;
    /* or any other relative font sizes */
  }
</style>
