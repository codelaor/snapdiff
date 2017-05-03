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

export default {
  async getCurrentRow({ rootState, getters }) {
    const table = getters.current;
    const rowKey = table.rowKey;
    const fields = table.columns;
    const dbRow = await rootState.connection.knex(table.name)
      .withSchema(table.schema)
      .where(rowKey)
      .then(result => {
        let row = {};
        if (result && result.length) {
          row = result[0];
        }
        return row;
      });

    const snapshotRow = !table.snapshotCreated ? {} : table.snapshot
      .find(row => {
        let matched = true;
        const unmatchedKey = table.primaryKeyFields
          .find(field => rowKey[field] !== row[field]);
        if (unmatchedKey) {
          matched = false;
        }
        return matched;
      });
    return fields
      .map(field => {
        const entry = {};
        entry.key = field.name;
        entry.dbValue = dbRow ? dbRow[field.name] : null;
        entry.snapshotValue = snapshotRow ? snapshotRow[field.name] : null;
        return entry;
      });
  },
  setTables({ rootState, dispatch, commit }) {
    // Get database tables using database helper (every client is different)
    return rootState.connection.dbHelper.getTables()
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
    return rootState.connection.dbHelper.getTableColumns(table.schema, table.name)
      .then((columns) => commit('setCurrentColumns', columns));
  },

  getTablePrimaryKeyFields({ rootState, state }, { schemaName, tableName }) {
    return rootState.connection.dbHelper.getTablePrimaryKeyFields(schemaName, tableName);
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
    const pageMultiplier = state.current.page ? state.current.page - 1 : 0;
    const offset = pageMultiplier * state.current.rowsPerPage;
    debugger; // eslint-disable-line
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

    // Reset current page if it was previously zero (set by buefy table when data)
    // but we now have data
    if (rows.length && !state.current.page) {
      commit('setCurrentPage', 1);
    }
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
    if (page > totalPages) {
      throw new Error("Can't set current page to number outside range of pages.");
    }
    commit('setCurrentPage', page);
    return dispatch('setCurrentRows');
  },

  setCurrentRowsPerPage({ dispatch, commit, state, getters }, rowsPerPage) {
    commit('setCurrentRowsPerPage', rowsPerPage);
    const newPageCount = getters.tablePageCount;
    debugger; //eslint-disable-line
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
      for (const prop in newerRow) { // eslint-disable-line no-restricted-syntax
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
            message: `Table exceeds ${rootState.settings.snapshotRowLimit} rows limit`,
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
