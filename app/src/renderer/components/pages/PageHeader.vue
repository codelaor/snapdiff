<template>
  <div class="header-page-header">
    <a class="button"
            v-if="showHome"
            v-on:click="goHome">
      <span class="icon">
        <i class="fa fa-home"></i>
      </span>
    </a>
    <a class="button" v-if="showBack"
            v-on:click="$router.go(-1)">
      <span class="icon">
        <i class="fa fa-arrow-left"></i>
      </span>
    </a>
    {{ title }}
  </div>
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
