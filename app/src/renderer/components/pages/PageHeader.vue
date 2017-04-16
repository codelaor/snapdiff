<template>
  <nav class="nav has-shadow">
    <div class="container">
      <div class="nav-left">
        <div class="nav-item field is-grouped">
          <img src="../../../../../art/banner_logo.svg"/>
          <a v-if="showBack"
                  v-on:click="$router.go(-1)">
            <span class="icon">
              <i class="fa fa-arrow-left"></i>
            </span>
          </a>
        </div>
      </div>
      
      <div class="nav-center">
        <span class="nav-item">{{ databaseTitle }}</span>
      </div>

      <div class="nav-right">
        <a class="nav-item" v-on:click="goHome">
          <span class="icon">
            <i class="fa fa-sign-out"></i>
          </span>
          Sign-out
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'page-header',
  props: {
    showBack: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      databaseTitle: this.$store.getters.databaseTitle,
      connection: this.$store.state.knex,
    };
  },
  watch: {
  },
  methods: {
    goHome() {
      this.$store.dispatch('disconnect')
        .then(() => this.$router.push({ name: 'home' }));
    },
  },
};

</script>

<style>

</style>
