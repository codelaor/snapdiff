<template>
  <div class="container">
    <!--<page-header :no-home="true"/>-->
    <div class="column">
      <page-header :no-home="true"/>
    </div>
    <div class="column is-half is-offset-one-quarter">
      <figure class="image">
        <img src="../../../../art/logo.png"
            alt="SnapDiff logo">
      </figure>
    </div>
  
    <div class="column is-offset-5">
      <div class="block">
        <b-radio-group v-model="connection.client">
          <div class="field"
               v-for="client in clients">
            <b-radio name="client"
                     v-bind:value="client.id"
                     v-bind:disabled="!client.supported">
              <span>{{ client.name }}</span>
              <span v-if="!client.supported"> (coming soon)</span>
            </b-radio>
          </div>
        </b-radio-group>
      </div>
    </div>
    <div class="column is-8 is-offset-2">
      <form>
        <span v-if="this.selectedClient.parameters.includes('filename')"> 
            <label class="label">Database file</label>
            <b-field>
              <input class="input expanded"
                    type="text"
                    name="host"
                    v-model="connection.filename">
              <p class="control">
                <a class="button" v-on:click="openFileDialog">
                  <b-icon icon="folder_open"/>
                </a>
              </p>
            </b-field>
          </span>
        <div class="field"
             v-if="this.selectedClient.parameters.includes('host')">
          <label class="label">Host</label>
          <p class="control">
            <input class="input"
                   type="text"
                   name="host"
                   v-model="connection.host">
          </p>
        </div>
        <div class="field"
             v-if="this.selectedClient.parameters.includes('port')">
          <label class="label">Port</label>
          <p class="control">
            <input class="input"
                   type="number"
                   name="port"
                   v-model="connection.port">
          </p>
        </div>
        <div class="field"
             v-if="this.selectedClient.parameters.includes('user')">
          <label class="label">User</label>
          <p class="control">
            <input class="input"
                   type="text"
                   name="user"
                   v-model="connection.user">
          </p>
        </div>
        <div class="field"
             v-if="this.selectedClient.parameters.includes('password')">
          <label class="label">Password</label>
          <p class="control">
            <input class="input"
                   type="password"
                   name="password"
                   v-model="connection.password">
          </p>
        </div>
        <div class="field"
             v-if="this.selectedClient.parameters.includes('database')">
          <label class="label">Database</label>
          <p class="control">
            <input class="input"
                   type="text"
                   name="database"
                   v-model="connection.database">
          </p>
        </div>
  
      </form>
    </div>
    <div class="column is-8 is-offset-2">
      <div class="block">
        <a class="button is-primary"
           v-on:click="connect">Connect</a>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from './PageHeader';
import { remote } from 'electron';
import fs from 'fs';

export default {
  name: 'home-page',
  components: {
    PageHeader,
  },
  data() {
    return {
      clients: this.$store.getters['connection/clients'],
      connection: {
        client: 'sqlite3',
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: '',
        database: 'postgres',
        filename: '',
      },
    };
  },
  computed: {
    selectedClient() {
      return this.$store.getters['connection/clients'].find(
        (client) => client.id === this.connection.client
      );
    },
  },
  methods: {
    openFileDialog() {
      const result = remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Database files', extensions: ['db'] },
          { name: 'All files', extensions: ['*'] },
        ],
      });
      if (result && result.length) {
        this.connection.filename = result[0];
      }
    },
    async connect() {
      try {
        this.validateFilename();
        await this.$store.dispatch('connection/connect', this.connection);
        await this.$store.dispatch('tables/setTables');
        this.$router.push({ name: 'database' });
      } catch (err) {
        this.$snackbar.open({
          message: err.message,
          type: 'is-danger',
          position: 'bottom-left',
          duration: 5000,
        });
      }
    },
    validateFilename() {
      // Check Filename is required
      if (this.selectedClient.parameters.includes('filename')) {
        // Check file name has been entered
        if (!this.connection.filename) {
          throw new Error('A database file name is required for this client.');
        }

        // See if file exists
        if (!fs.existsSync(this.connection.filename)) {
          throw new Error('File does not exist');
        }
      }
    },
  },
};

</script>

<style>

</style>
