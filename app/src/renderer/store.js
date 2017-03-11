import Vue from 'vue';
import Vuex from 'vuex';
import knex from 'knex';

Vue.use(Vuex);

// root state object.
const state = {
  connection: {
    client: 'pg',
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password: '',
    database: 'postgres',
    filename: '/home/peter/Downloads/chinook.db', // TODO remove default
  },
  knex: null,
  tables: [],
};

const mutations = {
  setKnex(state, newKnex) {
    state.knex = newKnex;
  },
  setConnection(state, connection) {
    Object.assign(state.connection, connection);
  },
  setTables(state, tables) {
    state.tables = tables;
  },
};

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  getTableColumns: ({ commit, state }, { schema, table }) => {
    let query;
    switch (state.connection.client) {
      case 'sqlite3':
        query = state.knex.schema.raw(`PRAGMA table_info(${table})`)
          // .orderBy('cid')
          .map((row) => ({
            name: row.name,
          }));
        break;
      case 'pg':
        query = state.knex('information_schema.columns')
          .where('table_schema', schema)
          .andWhere('table_name', table)
          // .orderBy('ordinal_position')
          .map((row) => ({
            name: row.column_name,
          }));
        break;
      default:
        throw new Error('Unsupported client type - do not know how to get table columns');
    }
    return query;
  },

  getTableContents({ commit, state }, { schema, table, limit, offset } = { limit: 50, offset: 0 }) {
    let query = state.knex(table); // eslint-disable-line
    if (schema) {
      query = query.withSchema(schema);
    }
    return query
      .limit(limit)
      .offset(offset);
  },

  connect: ({ commit, state }, parameters) => {
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
    commit('setConnection', Object.assign({}, parameters));
    commit('setKnex', knexConnection);

    // Get database tables from connection.  We need these anyway and it has the benefit
    // of testing our connection was successful
    switch (state.connection.client) {
      case 'sqlite3':
        // Query tables now and return promise for caller to wait on
        return knexConnection('sqlite_master')
          .select('name')
          .where('type', 'table')
          .orderBy('name')
          .then((result) => {
            commit('setTables', result);
          });
      case 'pg':
        return knexConnection('information_schema.tables')
          .select(['table_schema as schema', 'table_name as name'])
          .where('table_type', 'BASE TABLE')
          .orderBy(['schema', 'name'])
          .then((result) => {
            commit('setTables', result);
          });
      default:
        throw new Error('Unsupported client type - do not know how to read tables');
    }
  },
  disconnect: ({ commit }) => {
    // Kill any existing connection
    if (state.knex) {
      state.knex.destroy();
    }

    commit('setKnex', null);
  },
};

// getters are functions
const getters = {
  databaseTitle(state, getters) {
    let title = '';
    switch (state.connection.client) {
      case 'pg':
        title = state.connection.database;
        break;
      case 'sqlite3':
        title = state.connection.filename;
        break;
      default:
        title = getters
          .connectionClients
          .find(client => client.id === state.connection.client)
          .name;
    }
    return title;
  },
  connectionClients() {
    return [{
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
      id: 'sqlite3',
      name: 'SQLite3',
      hasSchemas: false,
      supported: true,
      parameters: [
        'filename',
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

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
