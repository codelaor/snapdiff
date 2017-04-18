import Vue from 'vue';
import Vuex from 'vuex';
import knex from 'knex';

Vue.use(Vuex);

function doesKeyMatch(rec1, rec2, keyFields) {
  const differences = keyFields.filter((keyField) => {
    let bHasDifferences = false;
    if (rec1[keyField] !== rec2[keyField]) {
      if (rec1[keyField].valueOf() !== rec2[keyField].valueOf()) {
        bHasDifferences = true;
      }
    }
    return bHasDifferences;
  });
  return differences.length < 1;
}

// root state object.
const state = {
  connection: {
    client: 'sqlite3',
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password: '',
    database: 'postgres',
    filename: '',
  },
  knex: null,
  tables: [],
  selectedTable: {
    index: -1,
    totalRows: 0,
    rowsPerPage: 10,
    currentPage: 1,
    currentRows: [],
    showSnapshot: false,
  },
};

const mutations = {
  setTableDiff(state, { schemaName, tableName, diff }) {
    const tableIndex = state.tables.findIndex(table =>
      table.schema === schemaName &&
      table.name === tableName
    );
    Vue.set(state.tables[tableIndex], 'diff', diff);
    Vue.set(state.tables[tableIndex], 'diffedAt', new Date());
  },

  setTableSnapshot(state, { schemaName, tableName, data }) {
    const tableIndex = state.tables.findIndex(table =>
      table.schema === schemaName &&
      table.name === tableName
    );
    state.tables[tableIndex].snapshot = data;
    state.tables[tableIndex].snapshotCreated = new Date();
  },

  setConnection(state, connection) {
    Object.assign(state.connection, connection);
  },

  setKnex(state, newKnex) {
    state.knex = newKnex;
  },

  setSelectedTable(state, { index }) {
    Vue.set(state, 'selectedTable', {
      index,
      totalRows: 0,
      rowsPerPage: 10,
      currentPage: 1,
      currentRows: [],
      showSnapshot: false,
    });
  },

  setTableShowSnapshot(state, { showSnapshot }) {
    state.selectedTable.showSnapshot = showSnapshot;
  },

  setTableCurrentPage(state, currentPage) {
    Vue.set(state.selectedTable, 'currentPage', currentPage);
  },

  setTableColumns(state, columns) {
    Vue.set(state.selectedTable, 'columns', columns);
    state.selectedTable.columns = columns;
  },

  setSelectedTableCurrentRows(state, currentRows) {
    Vue.set(state.selectedTable, 'currentRows', currentRows);
  },

  setTableRowsPerPage(state, rowsPerPage) {
    state.selectedTable.rowsPerPage = rowsPerPage;
  },

  setTableTotalRows(state, totalRows) {
    state.selectedTable.totalRows = totalRows;
  },

  setTables(state, tables) {
    state.tables = tables;
  },
};

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  async connect({ commit, state, dispatch }, parameters) {
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
    let queryTables;
    switch (state.connection.client) {
      case 'sqlite3':
        // Query tables now and return promise for caller to wait on
        queryTables = knexConnection('sqlite_master')
          .select('name')
          .where('type', 'table')
          .andWhere('name', '<>', 'sqlite_sequence')
          .andWhere('name', '<>', 'sqlite_stat1')
          .orderBy('name');
        break;
      case 'pg':
        queryTables = knexConnection('information_schema.tables')
          .select(['table_schema as schema', 'table_name as name'])
          .where('table_type', 'BASE TABLE')
          .andWhere('table_schema', '<>', 'information_schema')
          .andWhere('table_schema', '<>', 'pg_catalog')
          .orderBy(['schema', 'name']);
        break;
      default:
        throw new Error('Unsupported client type - do not know how to read tables');
    }
    await queryTables
      .then(async (results) => {
        const resultsWithPrimaryKeyFields = await Promise.all(results.map(async table => {
          const primaryKeyFields = await dispatch('getTablePrimaryKeyFields', {
            schemaName: table.schema,
            tableName: table.name,
          });
          return Object.assign(table, {
            snapshot: [],
            snapshotCreated: null,
            primaryKeyFields,
          });
        }));
        commit('setTables', resultsWithPrimaryKeyFields);
      });
  },

  disconnect: ({ commit }) => {
    // Kill any existing connection
    if (state.knex) {
      state.knex.destroy();
    }

    commit('setKnex', null);
  },

  getSelectedTableColumns: ({ commit, state }) => {
    const table = state.tables[state.selectedTable.index];
    let query;
    switch (state.connection.client) {
      case 'sqlite3':
        query = state.knex.schema.raw(`PRAGMA table_info(${table.name})`)
          // .orderBy('cid')
          .map((row) => ({
            name: row.name,
          }));
        break;
      case 'pg':
        query = state.knex('information_schema.columns')
          .where('table_schema', table.schema)
          .andWhere('table_name', table.name)
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

  async getTablePrimaryKeyFields({ state }, { schemaName, tableName }) {
    let query = '';
    let results = [];
    let fields = [];
    switch (state.connection.client) {
      case 'pg':
        query = state.knex.schema.raw(`
          SELECT a.attname as name
            FROM   pg_index i
            JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                AND a.attnum = ANY(i.indkey)
            WHERE  i.indrelid = '${schemaName}.${tableName}'::regclass
            AND    i.indisprimary;
        `);
        results = await query;
        fields = results.rows.map(row => row.name);
        break;
      case 'sqlite3':
        query = state.knex.schema.raw(`PRAGMA table_info(${tableName})`);
        results = await query;
        fields = results
          .filter(row => row.pk)
          .sort((a, b) => a.pk - b.pk)
          .map(row => row.name);
        break;
      default:
        throw new Error('Unsupported client type - do not know how to get primary key');
    }

    return fields;
  },

  setTableTotalRows({ commit, state }) {
    const table = state.tables[state.selectedTable.index];
    if (state.selectedTable.showSnapshot) {
      commit('setTableTotalRows', table.snapshot.length);
    } else {
      let query = state.knex(table.name); // eslint-disable-line
      if (table.schema) {
        query = query.withSchema(table.schema);
      }
      query
        .count('* as count')
        .then(results => {
          commit('setTableTotalRows', results[0].count);
        });
    }
  },

  async getTableRows({ commit, state }, {
    schemaName, tableName, fromSnapshot = false, primaryKeyFields, limit = 99999, offset = 0 }) {
    // Validate parameters
    if (!tableName) throw new Error('"tableName" is a required parameter for getTableRows');
    if (!primaryKeyFields) {
      throw new Error('"primaryKeyFields" is a required parameter for getTableRows');
    }

    let results = [];

    // Get data
    if (!fromSnapshot) {
      // No snapshot selected, get current data from database
      let query = state.knex(tableName); // eslint-disable-line
      if (schemaName) {
        query = query.withSchema(schemaName);
      }
      results = await query
        .orderByRaw(primaryKeyFields.join(','))
        .limit(limit)
        .offset(offset);
    } else {
      // Snapshot selected, get data from snapshot
      const table = state.tables.find(table =>
        table.name === tableName && table.schema === schemaName);
      results = table.snapshot.slice(offset, offset + limit);
    }
    return results;
  },

  async setSelectedTableCurrentRows({ dispatch, commit, state }) {
    // Calculate limit and offset - ie the portion of data to display
    // based on current paging values
    const limit = state.selectedTable.rowsPerPage;
    const offset = (state.selectedTable.currentPage - 1) * state.selectedTable.rowsPerPage;
    const selectedTable = state.tables[state.selectedTable.index];
    const currentRows = await dispatch('getTableRows', {
      schemaName: selectedTable.schema,
      tableName: selectedTable.name,
      fromSnapshot: state.selectedTable.showSnapshot,
      primaryKeyFields: selectedTable.primaryKeyFields,
      limit,
      offset,
    });
    commit('setSelectedTableCurrentRows', currentRows);
  },

  async setSelectedTable({ dispatch, commit, state }, { schemaName, tableName }) {
    const tableIndex = state.tables.findIndex(table =>
      table.schema === schemaName &&
      table.name === tableName
    );
    if (tableIndex < 0) {
      throw new Error(`Table '${tableName}' not found with schema '${schemaName}'`);
    }
    commit('setSelectedTable', { index: tableIndex });
    await dispatch('setSelectedTableCurrentRows'); // can fetch at same time
    await dispatch('setTableTotalRows'); // can fetch at same time
    return dispatch('getSelectedTableColumns'); // minimum need info
  },

  setTableCurrentPage({ dispatch, commit, state, getters }, currentPage) {
    const totalPages = getters.tablePageCount;
    if (currentPage > totalPages || currentPage < 1) {
      throw new Error("Can't set current page to number outside range of pages.");
    }
    commit('setTableCurrentPage', currentPage);
    return dispatch('setSelectedTableCurrentRows');
  },

  setTableRowsPerPage({ dispatch, commit, state, getters }, rowsPerPage) {
    commit('setTableRowsPerPage', rowsPerPage);
    const newPageCount = getters.tablePageCount;
    if (state.selectedTable.currentPage > newPageCount) {
      // Current page is now out of bounds - reset to last page
      commit('setTableCurrentPage', newPageCount);
    }
    return dispatch('setSelectedTableCurrentRows');
  },

  async setTableShowSnapshot({ dispatch, commit, state, getters }, showSnapshot) {
    commit('setTableShowSnapshot', showSnapshot);
    await dispatch('setTableTotalRows');
    return dispatch('setSelectedTableCurrentRows');
  },

  async getDiff({ commit, dispatch, state }, { schemaName, tableName, primaryKeyFields }) {
    const older = await dispatch('getTableRows', {
      schemaName,
      tableName,
      fromSnapshot: true,
      primaryKeyFields,
    });
    const newer = await dispatch('getTableRows', {
      schemaName,
      tableName,
      fromSnapshot: false,
      primaryKeyFields,
    });

    // Find removed records
    const removed = older.filter(olderRow => !newer.find(
      newerRow => doesKeyMatch(newerRow, olderRow, primaryKeyFields)))
      .map(removedRow => {
        removedRow.snapdiffChange = 'Removed';
        return removedRow;
      });

    // Find edited records
    const edited = newer.filter(newerRow => {
      const olderRow = older.find(
        row => doesKeyMatch(newerRow, row, primaryKeyFields)
      );
      if (!olderRow) {
        return false;
      }
      let diff = false;
      for (var prop in newerRow) { // eslint-disable-line
        if (olderRow[prop] !== newerRow[prop]) {
          if (olderRow[prop].valueOf() !== newerRow[prop].valueOf()) {
            diff = true;
            break;
          }
        }
      }
      return diff;
    }).map(editedRow => {
      editedRow.snapdiffChange = 'Edited';
      return editedRow;
    });

    // Find added/new records
    const added = newer.filter(newerRow => !older.find(
      olderRow => doesKeyMatch(newerRow, olderRow, primaryKeyFields)))
      .map(addedRow => {
        addedRow.snapdiffChange = 'Added';
        return addedRow;
      });
    return removed.concat(added).concat(edited);
  },

  diffTable({ commit, dispatch, state }, { schemaName, tableName }) {
    const table = state.tables.find(table =>
      table.name === tableName && table.schema === schemaName
    );
    return dispatch('getDiff', {
      schemaName,
      tableName,
      primaryKeyFields: table.primaryKeyFields,
    })
    .then(results => {
      commit('setTableDiff', {
        schemaName,
        tableName,
        diff: results,
      });
    });
  },

  snapshotTable({ commit, dispatch, state }, { schemaName, tableName }) {
    const table = state.tables.find(table =>
      table.name === tableName && table.schema === schemaName
    );
    return dispatch('getTableRows', {
      schemaName,
      tableName,
      primaryKeyFields: table.primaryKeyFields,
    })
    .then(results => {
      commit('setTableSnapshot', {
        schemaName,
        tableName,
        data: results,
      });
    });
  },

};

// getters are functions
const getters = {
  table(state) {
    // Merge props of selectedTable and record from tables into one combined
    // table object
    const table = state.tables[state.selectedTable.index];
    return Object.assign(table, state.selectedTable, {
      diffRowsChanged: table.diff ? table.diff.length : null,
    });
  },
  connectionClient(state, getters) {
    return getters.connectionClients.find(client =>
      client.id === state.connection.client);
  },
  connectionClients() {
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
    return Math.ceil(state.selectedTable.totalRows / state.selectedTable.rowsPerPage);
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
