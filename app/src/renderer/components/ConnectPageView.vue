<template>
  <div class="connect">
    <h1>Connect</h1>
    <h2>Client</h2>
    <form action="">
      <input type="radio" v-model="client" name="gender" value="pg"> PostgreSQL<br>
      <input type="radio" v-model="client" name="gender" value="sqlite3"> SQLite
    </form>
    <h2>Connection</h2>
    <form action="">
      <table>
        <tr>
          <td>Host:</td>
          <td><input type="text" name="host" v-model="host"></td>
        </tr>
        <tr>
          <td>Port:</td>
          <td><input type="number" name="port" v-model="port"></td>
        </tr>
        <tr>
          <td>User:</td>
          <td><input type="text" name="user" v-model="user"></td>
        </tr>
        <tr>
          <td>Password:</td>
          <td><input type="password" name="password" v-model="password"></td>
        </tr>
        <tr>
          <td>Database:</td>
          <td><input type="text" name="database" v-model="database"></td>
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
        client: 'pg',
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: '',
        database: 'postgres',
        connection: '',
        message: '',
      };
    },
    methods: {
      connect() {
        try {
          this.connection = knex({
            client: this.client,
            connection: {
              host: this.host,
              port: this.port,
              user: this.user,
              password: this.password,
              database: this.database,
            },
            debug: true,
            searchPath: 'knex,public',
            pool: {
              min: 0,
              max: 10,
              afterCreate(conn, cb) {
                // Only way to test if connection worked is by using afterCreate hook
                // https://github.com/tgriesser/knex/issues/1364
                // Execute a bullshit query to test if connection works.
                conn.query('SET timezone="UTC";', (err) => {
                  if (err) {
                    debugger; // eslint-disable-line
                    cb(err, conn);
                  } else {
                    // set trigram search match similarity limit
                    debugger; // eslint-disable-line
                    conn.query('SELECT set_limit(0.01);', (err) => {
                      cb(err, conn);
                    });
                  }
                });
              },
            },
          });
        } catch (error) {
          this.message = error.message;
          return;
        }

        debugger; // eslint-disable-line

        // Above constructor provides no feedback on whether credentials are ok so run
        // query now to get list of tables

        // PostgreSQL
        // SELECT table_name
        //  FROM information_schema.tables
        //  WHERE table_schema='public'
        //    AND table_type='BASE TABLE';

        process.on('unhandledRejection', (reason) => {
          debugger;   // eslint-disable-line
          console.error(reason);// eslint-disable-line
          process.exit(1);
        });


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
