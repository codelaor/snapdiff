<template>
  <div class="header-page">
    <page-header title="Oops"/>
    <div class="header-page-content-top">
      <p>Sorry, an unexpected error has occurred :(</p>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader';

  export default {
    name: 'error-page',
    components: {
      PageHeader,
    },
  };

</script>
