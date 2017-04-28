<template>
  <div class="container">
    <page-header :title="pageTitle" />
    <div class="column">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <b-tooltip label="Go back"
                       position="is-bottom">
              <a v-on:click="$router.go(-1)">
                <b-icon icon="arrow_back" />
              </a>
            </b-tooltip>
          </div>
        </div>
      </div>

      <table-row-form/>
    </div>
  
  </div>
</template>

<script>
import PageHeader from './PageHeader';
import TableRowForm from './TableRowForm';

export default {
  name: 'table-row-page',
  components: {
    PageHeader,
    TableRowForm,
  },
  computed: {
    pageTitle() {
      const title = `Table '${this.$store.getters['tables/current'].name}' Row`;
      return title;
    },
    row() {
      return this.$store.getters['tables/current']
        .find(row => {
          if (row.id) {
            return true;
          }
          return false;
        });
    },
  },
  methods: {
  },
};

</script>

<style>

</style>
