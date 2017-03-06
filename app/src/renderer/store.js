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
    error: '',
  },
  tables: [],
};

const mutations = {
  setConnection(state, connection) {
    // Kill any existing connection
    if (state.connection.knex) {
      state.connection.knex.destroy();
    }

    state.connection.knex = connection;
  },
  setConnectionProps(state, props) {
    Object.assign(state.connection.props, props);
  },
  setTables(state, tables) {
    state.tables = tables;
  },
};

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  connect: ({ commit, state }, connectionProps) => {
    commit('setConnectionProps', connectionProps);

    // Create connection object (does not attempt to connect until first query)
    const knexConnection = knex({
      client: state.connection.props.client,
      connection: {
        host: state.connection.props.host,
        port: state.connection.props.port,
        user: state.connection.props.user,
        password: state.connection.props.password,
        database: state.connection.props.database,
      },
      searchPath: 'knex,public',
    });
    commit('setConnection', knexConnection);

    // Get database tables from connection.  We need these anyway and it has the benefit
    // of testing our connection was successful
    return knexConnection('information_schema.tables')
      .select('table_name')
      .where('table_schema', 'public')
      .where('table_type', 'BASE TABLE')
      .then((result) => {
        commit('setTables', result);
      });
  },
  disconnect: ({ commit, state }) => {
    state.connection.knex.destroy();
    commit('setConnection', null);
  },
};

// getters are functions
const getters = {
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
