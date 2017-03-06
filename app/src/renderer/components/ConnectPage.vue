<template>

  <div class="header-page">
    <div class="header-page-header">
      <h1>Connect</h1>
    </div>
    <div class="header-page-content-centered">
      
      <h2>Client</h2>
      <form action="">
        <div v-for="client in clients">
          <table>
            <tr>
              <td>
                <input type="radio" v-model="props.client" name="client" v-bind:value="client.id" v-bind:disabled="!client.supported">
              </td>
              <td>
                <label v-bind:class="{ 'not-supported': !client.supported }">{{ client.name }}</label>
                <label class="coming-soon" v-if="!client.supported">coming soon</label>
              </td>
            </tr>
          </table>
        </div>      
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
    name: 'connect',
    data() {
      return {
        clients: this.$store.getters.connectionClients,
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
        this.$store.dispatch('connect', this.props)
          .then(() => {
            this.$router.push({ name: 'tables' });
          })
          .catch((err) => {
            this.message = err.message;
          });
      },
    },
  };

</script>

<style>
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
