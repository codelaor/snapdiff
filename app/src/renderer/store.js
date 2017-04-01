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
  table: {
    schema: '',
    name: '',
    totalRows: 0,
    rowsPerPage: 10,
    currentPage: 1,
    columns: [],
    rows: [],
  },
};

const mutations = {
  addTableSnapshot(state, { tableName, snapshot }) {
    const tableIndex = state.tables.findIndex(table => table.name === tableName);
    state.tables[tableIndex].snapshots.push(snapshot);
  },

  setConnection(state, connection) {
    Object.assign(state.connection, connection);
  },

  setKnex(state, newKnex) {
    state.knex = newKnex;
  },

  setTable(state, { schemaName, tableName }) {
    state.table = {
      name: tableName,
      schema: schemaName,
      totalRows: 0,
      rowsPerPage: 10,
      currentPage: 1,
      rows: [],
      columns: [],
    };
  },

  setTableCurrentPage(state, currentPage) {
    state.table.currentPage = currentPage;
  },

  setTableColumns(state, columns) {
    state.table.columns = columns;
  },

  setTableRows(state, rows) {
    state.table.rows = rows;
  },

  setTableRowsPerPage(state, rowsPerPage) {
    state.table.rowsPerPage = rowsPerPage;
  },

  setTableTotalRows(state, totalRows) {
    state.table.totalRows = totalRows;
  },

  setTables(state, tables) {
    state.tables = tables;
  },
};

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
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
            commit('setTables', result.map(table => Object.assign(table, { snapshots: [] })));
          });
      case 'pg':
        return knexConnection('information_schema.tables')
          .select(['table_schema as schema', 'table_name as name'])
          .where('table_type', 'BASE TABLE')
          .andWhere('table_schema', '<>', 'information_schema')
          .andWhere('table_schema', '<>', 'pg_catalog')
          .orderBy(['schema', 'name'])
          .then((result) => {
            // commit('setTables', result);
            commit('setTables', result.map(table => Object.assign(table, { snapshots: [] })));
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

  getTableColumns: ({ commit, state }) => {
    let query;
    switch (state.connection.client) {
      case 'sqlite3':
        query = state.knex.schema.raw(`PRAGMA table_info(${state.table.name})`)
          // .orderBy('cid')
          .map((row) => ({
            name: row.name,
          }));
        break;
      case 'pg':
        query = state.knex('information_schema.columns')
          .where('table_schema', state.table.schema)
          .andWhere('table_name', state.table.name)
          // .orderBy('ordinal_position')
          .map((row) => ({
            name: row.column_name,
          }));
        break;
      default:
        throw new Error('Unsupported client type - do not know how to get table columns');
    }

    return query.then((columns) => commit('setTableColumns', columns));
  },

  getTableTotalRows({ commit, state }) {
    let query = state.knex(state.table.name); // eslint-disable-line
    if (state.table.schema) {
      query = query.withSchema(state.table.schema);
    }
    query
      .count('* as count')
      .then(results => {
        commit('setTableTotalRows', results[0].count);
      });
  },

  getTableRows({ commit, state }) {
    let query = state.knex(state.table.name); // eslint-disable-line
    if (state.table.schema) {
      query = query.withSchema(state.table.schema);
    }
    query
      .limit(state.table.rowsPerPage)
      .offset((state.table.currentPage - 1) * state.table.rowsPerPage)
      .then(results => {
        commit('setTableRows', results);
      });
  },

  setTable({ dispatch, commit, state }, { schemaName, tableName }) {
    commit('setTable', { schemaName, tableName });
    dispatch('getTableRows'); // can fetch at same time
    dispatch('getTableTotalRows'); // can fetch at same time
    return dispatch('getTableColumns'); // minimum need info
  },

  setTableCurrentPage({ dispatch, commit, state, getters }, currentPage) {
    const totalPages = getters.tablePageCount;
    if (currentPage > totalPages || currentPage < 1) {
      throw new Error("Can't set current page to number outside range of pages.");
    }
    commit('setTableCurrentPage', currentPage);
    return dispatch('getTableRows');
  },

  setTableRowsPerPage({ dispatch, commit, state, getters }, rowsPerPage) {
    commit('setTableRowsPerPage', rowsPerPage);
    const newPageCount = getters.tablePageCount;
    if (state.table.currentPage > newPageCount) {
      // Current page is now out of bounds - reset to last page
      commit('setTableCurrentPage', newPageCount);
    }
    return dispatch('getTableRows');
  },

  snapshotTables({ commit, state }) {
    state.tables.forEach(table => {
      state.knex(table.name).then(results =>
        commit('addTableSnapshot', {
          tableName: table.name,
          snapshot: results,
        })
      );
    });
  },
};

// getters are functions
const getters = {
  connectionClient(state, getters) {
    return getters.connectionClients.find(client =>
      client.id === state.connection.client);
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
  tablePageCount(state) {
    return Math.ceil(state.table.totalRows / state.table.rowsPerPage);
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
