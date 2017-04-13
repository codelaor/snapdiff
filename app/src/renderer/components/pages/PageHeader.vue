<template>
  <nav class="nav has-border">
    <div class="container">
      <div class="nav-left">
        <div class="nav-item field is-grouped">
          <a 
                  v-if="showHome"
                  v-on:click="goHome">
            <span class="icon">
              <i class="fa fa-home"></i>
            </span>
          </a>
          <a v-if="showBack"
                  v-on:click="$router.go(-1)">
            <span class="icon">
              <i class="fa fa-arrow-left"></i>
            </span>
          </a>
        </div>
      </div>
      
      <span class="nav-item">{{ title }}</span>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'page-header',
  props: {
    showHome: {
      type: Boolean,
      default: true,
    },
    showBack: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 100,
    },
  },
  data() {
    return {
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
