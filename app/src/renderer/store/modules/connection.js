import knex from 'knex';
import PostgresHelper from './connection/PostgresHelper';
import SqliteHelper from './connection/SqliteHelper';

// root state object.
const state = {
  client: '',
  host: '',
  port: '',
  user: '',
  password: '',
  database: '',
  filename: '',
  knex: null,
  dbHelper: null,
};

const mutations = {
  setConnection(state, connection) {
    state.client = connection.client;
    state.host = connection.host;
    state.port = connection.port;
    state.user = connection.user;
    state.password = connection.password;
    state.database = connection.database;
    state.filename = connection.filename;
  },
  setKnex(state, { knex, client }) {
    state.knex = knex;
    switch (client) {
      case 'pg':
        state.dbHelper = new PostgresHelper(knex);
        break;
      case 'sqlite3':
        state.dbHelper = new SqliteHelper(knex);
        break;
      default:
        state.dbHelper = null;
    }
  },
};

const actions = {
  async connect({ commit, state, dispatch }, parameters) {
    // Test client is supported by requiring module now.  If we don't and it fails inside
    // knex it's a fatal error and the application crashes
    try {
      switch (parameters.client) {
        case 'sqlite3':
          require('sqlite3');
          break;
        case 'pg':
          require('pg');
          break;
        default:
          throw new Error(`Unsupported client ${parameters.client}`);
      }
    } catch (err) {
      // TODO turn off client support, select another client
      throw err;
    }

    // Create knex object (does not attempt to connect until first query)
    const knexConnection = knex({
      client: parameters.client,
      connection: {
        host: parameters.host,
        port: parameters.port,
        user: parameters.user,
        password: parameters.password,
        database: parameters.database,
        filename: parameters.filename,
      },
      useNullAsDefault: true,
    });

    commit('setConnection', parameters);
    commit('setKnex', {
      knex: knexConnection,
      client: parameters.client,
    });
  },

  disconnect: ({ commit }) => {
    // Kill any existing connection
    if (state.knex) {
      state.knex.destroy();
    }

    commit('setKnex', {
      knex: null,
      client: null,
    });
  },
};

const getters = {
  client(state, getters) {
    return getters.clients.find(client =>
      client.id === state.client);
  },
  databaseTitle(state, getters) {
    let title = '';
    let lastSlash = 0;
    switch (state.client) {
      case 'pg':
        title = state.database;
        break;
      case 'sqlite3':
        lastSlash = state.filename.lastIndexOf('/') + 1;  // TODO - check if works with windows
        title = state.filename.substring(lastSlash);
        break;
      default:
        title = getters.client.name;
    }
    return title;
  },
  clients() {
    return [{
      id: 'sqlite3',
      name: 'SQLite3',
      hasSchemas: false,
      supported: true,
      parameters: [
        'filename',
      ],
    }, {
      id: 'pg',
      name: 'PostgresQL',
      hasSchemas: true,
      supported: true,
      parameters: [
        'host',
        'port',
        'user',
        'password',
        'database',
      ],
    }, {
      id: 'mysql',
      name: 'MySQL',
      hasSchemas: true, // TODO find out correct answer
      supported: false,
      parameters: [
        // TODO add these
      ],
    }, {
      id: 'mariasql',
      name: 'MariaDB',
      hasSchemas: true, // TODO find out correct answer
      supported: false,
      parameters: [
        // TODO add these
      ],
    }, {
      id: 'oracle',
      name: 'Oracle',
      hasSchemas: true, // TODO find out correct answer
      supported: false,
      parameters: [
        // TODO add these
      ],
    }];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
