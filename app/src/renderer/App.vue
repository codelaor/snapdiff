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
    justify-content: flex-start;
    width: 100%;
    top: 0;
    left: 0;
    font-size: 2em;
  }

  .header-page-header > * {
    margin-right: 5px;
  }

  .header-page-header > button {
    height: 2.2em;
    width: 2.2em;
  }
  
  .header-page-header,
  .header-page-content-top,
  .header-page-content-centered {
    box-sizing: border-box;
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

  .header-page-toolbar-top-right {
    display: flex;
    justify-content: flex-end;
  }

  select, button {
    box-sizing: border-box;
    border:1px solid gray;
    padding:.2em .6em;
    margin:0;
    height:26px;  
  }

  .fa-icon {
    width: auto;
    height: auto;
  }

  button > svg {
    vertical-align: bottom;
  }

  .snapdiff-data-table-container {
    overflow-x: scroll;
  }

	.snapdiff-data-table {
		width:100%; 
		border-collapse:collapse; 
	}

	.snapdiff-data-table th{ 
		padding:7px; border:slategray 1px solid;
    background-color: slategray;
    color: antiquewhite;
    white-space:nowrap;
	}

	.snapdiff-data-table td{ 
		padding:7px; 
    border:slategray 1px solid;
    white-space:nowrap;
	}

	/*  Define the background color for all the ODD background rows  */
	.snapdiff-data-table tr:nth-child(odd){ 
		background: #fefefe;
	}
	/*  Define the background color for all the EVEN background rows  */
	.snapdiff-data-table tr:nth-child(even){
		background: #f5f5f5;
	}

  .snapdiff-data-table tr td:first-child{
      width:1%;
      white-space:nowrap;
  }  

</style>
