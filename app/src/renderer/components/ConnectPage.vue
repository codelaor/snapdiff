<template>

  <div class="header-page">
    <div class="header-page-header">
      <h1>Connect</h1>
    </div>
    <div class="header-page-content-centered">
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
  input[type="radio"]:disabled + label {
    font-style: italic;
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
