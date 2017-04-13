<template>
  <div class="container">
    <div class="column is-half is-offset-one-quarter">
      <img class="home-page-group"
           src="./Home/logo.png"
           alt="electron-vue">
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
                <span class="icon">
                  <i class="fa fa-folder-open-o"></i>
                </span>
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
        <a class="button is-primary" v-on:click="connect">Connect</a>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron';

export default {
  name: 'home-page',
  data() {
    return {
      clients: this.$store.getters.connectionClients,
      connection: this.$store.state.connection,
    };
  },
  computed: {
    selectedClient() {
      return this.$store.getters.connectionClients.find(
        (client) => client.id === this.connection.client
      );
    },
  },
  methods: {
    openFileDialog() {
      [this.connection.filename] = remote.dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Database files', extensions: ['db'] },
          { name: 'All files', extensions: ['*'] },
        ],
      });
    },
    connect() {
      this.$store.dispatch('connect', this.connection)
        .then(() => {
          this.$router.push({ name: 'database' });
        })
        .catch((err) => {
          this.$toast.open({
            message: err.message,
            position: 'bottom',
            type: 'is-danger',
          });
        });
    },
  },
};

</script>

<style>

</style>
