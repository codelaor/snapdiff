import Vue from 'vue';

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

const state = {
  all: [],
  current: {
    index: -1,
    totalRows: 0,
    rowsPerPage: 10,
    page: 1,
    rows: [],
    showSnapshot: false,
  },
};

const mutations = {
  setTableDiff(state, { schemaName, tableName, diff }) {
    const tableIndex = state.all.findIndex(table =>
      table.schema === schemaName &&
      table.name === tableName
    );
    Vue.set(state.all[tableIndex], 'diff', diff);
    Vue.set(state.all[tableIndex], 'diffedAt', new Date());
  },

  setTableSnapshot(state, { schemaName, tableName, data }) {
    const tableIndex = state.all.findIndex(table =>
      table.schema === schemaName &&
      table.name === tableName
    );
    state.all[tableIndex].snapshot = data;
    state.all[tableIndex].snapshotCreated = new Date();
  },

  setTableSnapshotError(state, { schemaName, tableName, message }) {
    const tableIndex = state.all.findIndex(table =>
      table.schema === schemaName &&
      table.name === tableName
    );
    Vue.set(state.all[tableIndex], 'snapshotError', message);
  },

  setCurrentTable(state, { index }) {
    Vue.set(state, 'current', {
      index,
      totalRows: 0,
      rowsPerPage: 10,
      page: 1,
      columns: [],
      rows: [],
      showSnapshot: false,
    });
  },

  setCurrentShowSnapshot(state, { showSnapshot }) {
    state.current.showSnapshot = showSnapshot;
  },

  setCurrentPage(state, page) {
    Vue.set(state.current, 'page', page);
  },

  setCurrentColumns(state, columns) {
    Vue.set(state.current, 'columns', columns);
    state.current.columns = columns;
  },

  setCurrentRows(state, rows) {
    Vue.set(state.current, 'rows', rows);
  },

  setCurrentRowsPerPage(state, rowsPerPage) {
    state.current.rowsPerPage = rowsPerPage;
  },

  setCurrentTotalRows(state, totalRows) {
    state.current.totalRows = totalRows;
  },

  setTables(state, tables) {
    state.all = tables;
  },
};

const actions = {
  setTables({ rootState, dispatch, commit }) {
    // Get database tables from connection.  We need these anyway and it has the benefit
    // of testing our connection was successful
    let queryTables;
    switch (rootState.connection.client) {
      case 'sqlite3':
        // Query tables now and return promise for caller to wait on
        queryTables = rootState.connection.knex('sqlite_master')
          .select('name')
          .where('type', 'table')
          .andWhere('name', '<>', 'sqlite_sequence')
          .andWhere('name', '<>', 'sqlite_stat1')
          .orderBy('name');
        break;
      case 'pg':
        queryTables = rootState.connection.knex('information_schema.tables')
          .select(['table_schema as schema', 'table_name as name'])
          .where('table_type', 'BASE TABLE')
          .andWhere('table_schema', '<>', 'information_schema')
          .andWhere('table_schema', '<>', 'pg_catalog')
          .orderBy(['schema', 'name']);
        break;
      default:
        throw new Error('Unsupported client type - do not know how to read tables');
    }
    return queryTables
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

  setCurrentTableColumns: ({ commit, state, rootState }) => {
    const table = state.all[state.current.index];
    let query;
    switch (rootState.connection.client) {
      case 'sqlite3':
        query = rootState.connection.knex.schema.raw(`PRAGMA table_info(${table.name})`)
          // .orderBy('cid')
          .map((row) => ({
            name: row.name,
          }));
        break;
      case 'pg':
        query = rootState.connection.knex('information_schema.columns')
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

    return query.then((columns) => commit('setCurrentColumns', columns));
  },

  async getTablePrimaryKeyFields({ rootState, state }, { schemaName, tableName }) {
    let query = '';
    let results = [];
    let fields = [];
    switch (rootState.connection.client) {
      case 'pg':
        query = rootState.connection.knex.schema.raw(`
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
        query = rootState.connection.knex.schema.raw(`PRAGMA table_info(${tableName})`);
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

  setCurrentTotalRows({ commit, state, rootState }) {
    const table = state.all[state.current.index];
    if (state.current.showSnapshot) {
      commit('setCurrentTotalRows', table.snapshot.length);
    } else {
      let query = rootState.connection.knex(table.name);
      if (table.schema) {
        query = query.withSchema(table.schema);
      }
      query
        .count('* as count')
        .then(results => {
          commit('setCurrentTotalRows', results[0].count);
        });
    }
  },

  async getTableRows({ commit, state, rootState }, {
    schemaName, tableName, fromSnapshot = false, primaryKeyFields, limit = 99999, offset = 0,
  }) {
    // Validate parameters
    if (!tableName) throw new Error('"tableName" is a required parameter for getTableRows');
    if (!primaryKeyFields) {
      throw new Error('"primaryKeyFields" is a required parameter for getTableRows');
    }

    let results = [];

    // Get data
    if (!fromSnapshot) {
      // No snapshot selected, get current data from database
      let query = rootState.connection.knex(tableName);
      if (schemaName) {
        query = query.withSchema(schemaName);
      }
      results = await query
        .orderByRaw(primaryKeyFields.join(','))
        .limit(limit)
        .offset(offset);
    } else {
      // Snapshot selected, get data from snapshot
      const table = state.all.find(table =>
        table.name === tableName && table.schema === schemaName);
      results = table.snapshot.slice(offset, offset + limit);
    }
    return results;
  },

  async setCurrentRows({ dispatch, commit, state }) {
    // Calculate limit and offset - ie the portion of data to display
    // based on current paging values
    const limit = state.current.rowsPerPage;
    const offset = (state.current.page - 1) * state.current.rowsPerPage;
    const selectedTable = state.all[state.current.index];
    const rows = await dispatch('getTableRows', {
      schemaName: selectedTable.schema,
      tableName: selectedTable.name,
      fromSnapshot: state.current.showSnapshot,
      primaryKeyFields: selectedTable.primaryKeyFields,
      limit,
      offset,
    });
    commit('setCurrentRows', rows);
  },

  async setCurrentTable({ dispatch, commit, state }, { schemaName, tableName }) {
    const tableIndex = state.all.findIndex(table =>
      table.schema === schemaName &&
      table.name === tableName
    );
    if (tableIndex < 0) {
      throw new Error(`Table '${tableName}' not found with schema '${schemaName}'`);
    }
    commit('setCurrentTable', { index: tableIndex });
    await dispatch('setCurrentRows'); // can fetch at same time
    await dispatch('setCurrentTotalRows'); // can fetch at same time
    return dispatch('setCurrentTableColumns'); // minimum need info
  },

  setCurrentPage({ dispatch, commit, state, getters }, page) {
    const totalPages = getters.tablePageCount;
    if (page > totalPages || page < 1) {
      throw new Error("Can't set current page to number outside range of pages.");
    }
    commit('setCurrentPage', page);
    return dispatch('setCurrentRows');
  },

  setCurrentRowsPerPage({ dispatch, commit, state, getters }, rowsPerPage) {
    commit('setCurrentRowsPerPage', rowsPerPage);
    const newPageCount = getters.tablePageCount;
    if (state.current.page > newPageCount) {
      // Current page is now out of bounds - reset to last page
      commit('setCurrentPage', newPageCount);
    }
    return dispatch('setCurrentRows');
  },

  async setCurrentShowSnapshot({ dispatch, commit, state, getters }, showSnapshot) {
    commit('setCurrentShowSnapshot', showSnapshot);
    await dispatch('setCurrentTotalRows');
    return dispatch('setCurrentRows');
  },

  async getTableDiff({ commit, dispatch, state }, { schemaName, tableName, primaryKeyFields }) {
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

  async diffTable({ commit, dispatch, state }, { schemaName, tableName }) {
    const table = state.all.find(table =>
      table.name === tableName && table.schema === schemaName
    );

    const diff = await dispatch('getTableDiff', {
      schemaName,
      tableName,
      primaryKeyFields: table.primaryKeyFields,
    });

    commit('setTableDiff', {
      schemaName,
      tableName,
      diff,
    });
  },

  snapshotTable({ commit, dispatch, state, rootState }, { schemaName, tableName }) {
    debugger; // eslint-disable-line
    const table = state.all.find(table =>
      table.name === tableName && table.schema === schemaName
    );
    return dispatch('getTableRows', {
      schemaName,
      tableName,
      primaryKeyFields: table.primaryKeyFields,
      limit: rootState.settings.snapshotRowLimit + 1,
    })
      .then(results => {
        if (results.length > rootState.settings.snapshotRowLimit) {
          commit('setTableSnapshotError', {
            schemaName,
            tableName,
            message: `Table exceeds ${rootState.settings.snapshotRowLimit} rows`,
          });
        } else {
          commit('setTableSnapshot', {
            schemaName,
            tableName,
            data: results,
          });
        }
      });
  },

};

// getters are functions
const getters = {
  current(state) {
    // Merge props of current table and record from tables into one combined
    // table object
    const table = state.all[state.current.index];
    return Object.assign(table, state.current);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
