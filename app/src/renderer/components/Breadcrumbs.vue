<template>
  <div>
    <span v-for="(route, index) in routes">
      <span v-if="index > 0">
        >>
      </span>

      <a v-if="index !== routes.length - 1" @click="goBack(index - routes.length + 1)">
        {{ route.title }}
      </a>
      <span v-else>
        {{ route.title }}
      </span>

    </span>
  </div>
</template>

<script>
  export default {
    computed: {
      routes() {
        const routes = [];
        /* eslint-disable no-fallthrough */
        switch (this.$route.name) {
          case 'row':
            routes.push({ title: 'Row' });
          case 'table':
            routes.push({
              title: `Table '${this.$store.getters['tables/current'].name}'`,
            });
          case 'database':
            routes.push({
              title: `Database '${this.$store.getters['connection/databaseTitle']}'`,
            });
          default:
            routes.push({
              title: 'Home',
            });
            break;
        }
        /* eslint-enable no-fallthrough */
        return routes.reverse();
      },
    },
    methods: {
      goBack(levels) {
        this.$router.go(levels);
      },
    },
  };
</script>
