import Vue from 'vue';
import Vuex from 'vuex';
import * as knex from 'knex';

Vue.use(Vuex);

// root state object.
const state = {
  connection: {
    props: {
      client: 'pg',
      host: 'localhost',
      port: '5432',
      user: 'postgres',
      password: '',
      database: 'postgres',
    },
    knex: '',
  },
};

const mutations = {
  setConnection(state, connection) {
    // Kill any existing connection
    if (state.connection) {
      state.connection.destroy();
    }

    state.connection.knex = connection;
  },
  setConnectionProperties(state, props) {
    // Kill any existing connection
    if (state.connection) {
      state.connection.destroy();
    }

    Object.assign(props, state.connection.props);
  },
};

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  connect: ({ commit, state }) => {
    // Create connection object (does not attempt to connect until first query)
    try {
      const knexConnection = knex({
        client: state.connection.properties.client,
        connection: {
          host: state.connection.properties.host,
          port: state.connection.properties.port,
          user: state.connection.properties.user,
          password: state.connection.properties.password,
          database: state.connection.properties.database,
        },
        debug: true,
        searchPath: 'knex,public',
      });
      commit('setConnection', knexConnection);


      // Get database tables from connection.  We need these anyway and it has the benefit
      // of testing our connection was successful
      return this.connection('information_schema.tables')
        .select('table_name')
        .where('table_schema', 'public')
        .where('table_type', 'BASE TABLE')
        .then((result) => {
          console.log(result); // eslint-disable-line
        })
        .catch((error) => {
          this.message = error.message;
        });
    } catch (error) {
      this.message = error.message;
      return Promise.reject(this.message);
    }
  },
  // increment: ({ commit }) => commit('increment'),
  // decrement: ({ commit }) => commit('decrement'),
  // incrementIfOdd({ commit, state }) {
  //   if ((state.count + 1) % 2 === 0) {
  //     commit('increment');
  //   }
  // },
  // incrementAsync({ commit }) {
  //   return new Promise((resolve, reject) => { // eslint-disable-line
  //     setTimeout(() => {
  //       commit('increment');
  //       resolve();
  //     }, 1000);
  //   });
  // },
};

// getters are functions
const getters = {
  connectionProperties: state => state.connection.props,
  knex: state => state.connection.knex,
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
