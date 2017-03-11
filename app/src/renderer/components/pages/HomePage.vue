<template>

  <div class="home-page">
    <img class="home-page-group" src="./Home/logo.png" alt="electron-vue">
    <form action="" class="home-page-group">
      <div v-for="client in clients">
        <table>
          <tr>
            <td>
              <input type="radio" v-model="connection.client" name="client" v-bind:value="client.id" v-bind:disabled="!client.supported">
            </td>
            <td>
              <label v-bind:class="{ 'not-supported': !client.supported }">{{ client.name }}</label>
              <label class="coming-soon" v-if="!client.supported">coming soon</label>
            </td>
          </tr>
        </table>
      </div>
    </form>

    <div class="home-page-group">
      <form action="">
        <table>
          <tr v-if="this.selectedClient.parameters.includes('filename')">
            <td>Filename:</td>
            <td><input type="text" name="host" v-model="connection.filename"></td>
          </tr>
          <tr v-if="this.selectedClient.parameters.includes('host')">
            <td>Host:</td>
            <td><input type="text" name="host" v-model="connection.host"></td>
          </tr>
          <tr v-if="this.selectedClient.parameters.includes('port')">
            <td>Port:</td>
            <td><input type="number" name="port" v-model="connection.port"></td>
          </tr>
          <tr v-if="this.selectedClient.parameters.includes('user')">
            <td>User:</td>
            <td><input type="text" name="user" v-model="connection.user"></td>
          </tr>
          <tr v-if="this.selectedClient.parameters.includes('password')">
            <td>Password:</td>
            <td><input type="password" name="password" v-model="connection.password"></td>
          </tr>
          <tr v-if="this.selectedClient.parameters.includes('database')">
            <td>Database:</td>
            <td><input type="text" name="database" v-model="connection.database"></td>
          </tr>
        </table>
      </form>

      <button v-on:click="connect">Connect</button>

      <div class="message-area">
        <div class="error-message" v-bind:hidden="!message">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home-page',
    data() {
      return {
        clients: this.$store.getters.connectionClients,
        connection: this.$store.state.connection,
        message: '',
      };
    },
    computed: {
      selectedClient() {
        return this.$store.getters.connectionClients.find(
          (client) => client.id === this.connection.client
        );
      },
    },
    watch: {
      connection: {
        handler() {
          this.message = '';
        },
        deep: true,
      },
    },
    methods: {
      connect() {
        this.$store.dispatch('connect', this.connection)
          .then(() => {
            this.$router.push({ name: 'database' });
          })
          .catch((err) => {
            this.message = err.message;
          });
      },
    },
  };

</script>

<style>
  img {
    /*margin-top: -25px;*/
    width: 450px;
  }
  
  .home-page {
    width: 100%;
    height: 100%;
    align-items: center;
    background: radial-gradient( ellipse at center, rgba(255, 255, 255, 1) 0%, rgba(229, 229, 229, .85) 100%);
    background-position: center;
    display: flex;
    flex-direction: column;
    font-family: Lato, Helvetica, sans-serif;
    justify-content: center;
    box-sizing: border-box;
    text-align: center;
  }

  .home-page-group {
    padding: 15px;
  }
  
  input {
    padding: 3px;
  }
  
  input[type="radio"]:disabled + label {
    font-style: italic;
  }
  
  .not-supported {
    font-style: italic;
  }
  
  .coming-soon {
    margin-left: 3px;
    vertical-align: baseline;
    font-size: .7em;
    font-weight: bold;
  }
  
  .message-area {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .error-message {
    background-color: red;
    color: white;
    font-weight: bold;
    margin-top: 20px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 3px;
    width: fit-content;
  }
</style>
