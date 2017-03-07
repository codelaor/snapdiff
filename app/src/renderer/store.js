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
      filename: '/home/peter/Downloads/chinook.db', // TODO remove default
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
        filename: state.connection.props.filename,
      },
      useNullAsDefault: true,
    });
    commit('setConnection', knexConnection);

    // Get database tables from connection.  We need these anyway and it has the benefit
    // of testing our connection was successful
    switch (state.connection.props.client) {
      case 'sqlite3':
        return knexConnection('sqlite_master')
          .select('name')
          .where('type', 'table')
          .orderBy('name')
          .then((result) => {
            commit('setTables', result);
          });
      case 'pg':
        return knexConnection('information_schema.tables')
          .select('table_name as name')
          .where('table_schema', 'public')
          .where('table_type', 'BASE TABLE')
          .orderBy('name')
          .then((result) => {
            commit('setTables', result);
          });
      default:
        throw new Error('Unsupported client type - do not know how to read tables');
    }
  },
  disconnect: ({ commit, state }) => {
    state.connection.knex.destroy();
    commit('setConnection', null);
  },
};

// getters are functions
const getters = {
  connectionClients() {
    return [{
      id: 'pg',
      name: 'PostgresQL',
      supported: true,
      connectionProps: [
        'host',
        'port',
        'user',
        'password',
        'database',
      ],
    }, {
      id: 'sqlite3',
      name: 'SQLite3',
      supported: true,
      connectionProps: [
        'filename',
      ],
    }, {
      id: 'mysql',
      name: 'MySQL',
      supported: false,
      connectionProps: [
        // TODO add these
      ],
    }, {
      id: 'mariasql',
      name: 'MariaDB',
      supported: false,
      connectionProps: [
        // TODO add these
      ],
    }, {
      id: 'oracle',
      name: 'Oracle',
      supported: false,
      connectionProps: [
        // TODO add these
      ],
    }];
  },
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
