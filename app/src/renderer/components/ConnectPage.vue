<template>
  <div class="connect">
    <h1>Connect</h1>
    <h2>Client</h2>
    <form action="">
      <input type="radio" v-model="props.client" name="client" value="pg"><label>PostgreSQL</label><br>
      <input type="radio" v-model="props.client" name="client" value="mysql" disabled><label>MySQL (coming soon)</label><br>
      <input type="radio" v-model="props.client" name="client" value="oracle" disabled><label>Oracle (coming soon)</label><br>
      <input type="radio" v-model="props.client" name="client" value="sqlite3" disabled><label>SQLite 3 (coming soon)</label><br>
      <input type="radio" v-model="props.client" name="client" value="sqlite3" disabled><label>Maria DB (coming soon)</label>
    </form>
    <h2>Connection</h2>
    <form action="">
      <table>
        <tr>
          <td>Host:</td>
          <td><input type="text" name="host" v-model="props.host"></td>
        </tr>
        <tr>
          <td>Port:</td>
          <td><input type="number" name="port" v-model="props.port"></td>
        </tr>
        <tr>
          <td>User:</td>
          <td><input type="text" name="user" v-model="props.user"></td>
        </tr>
        <tr>
          <td>Password:</td>
          <td><input type="password" name="password" v-model="props.password"></td>
        </tr>
        <tr>
          <td>Database:</td>
          <td><input type="text" name="database" v-model="props.database"></td>
        </tr>
      </table>
    </form>

    <button v-on:click="connect">Connect</button>

    <div>
      {{ message }}
    </div>

  </div>
</template>

<script>
  import * as knex from 'knex';
  import * as pg from 'pg'; // eslint-disable-line

  export default {
    name: 'connect',
    data() {
      return {
        props: this.$store.state.connection.props,
        connection: '',
        message: '',
      };
    },
    watch: {
      props: {
        handler: function watchProps() {    // eslint-disable-line object-shorthand
          this.message = '';
        },
        deep: true,
      },
    },
    methods: {
      connect() {
        try {
          this.connection = knex({
            client: this.props.client,
            connection: {
              host: this.props.host,
              port: this.props.port,
              user: this.props.user,
              password: this.props.password,
              database: this.props.database,
            },
            debug: true,
            searchPath: 'knex,public',
          });
        } catch (error) {
          this.message = error.message;
          return;
        }


        // Above constructor provides no feedback on whether credentials are ok so run
        // query now to get list of tables which will trigger connection error if failed

        // PostgreSQL
        // SELECT table_name
        //  FROM information_schema.tables
        //  WHERE table_schema='public'
        //    AND table_type='BASE TABLE';


        this.connection('information_schema.tables')
          .select('table_name')
          .where('table_schema', 'public')
          .where('table_type', 'BASE TABLE')
          .then((result) => {
            console.log(result); // eslint-disable-line
          })
          .catch((error) => {
            this.message = error.message;
          });
      },
    },
  };

</script>

<style>

input[type="radio"]:disabled + label {
  font-style: italic;
}

</style>
