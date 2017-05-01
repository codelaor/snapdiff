import Vue from 'vue';

export default {
  setTableDiff(state, { schemaName, tableName, diff }) {
    const tableIndex = state.all.findIndex(table =>
      table.schema === schemaName &&
      table.name === tableName
    );
    Vue.set(state.all[tableIndex], 'diff', diff);
    Vue.set(state.all[tableIndex], 'diffedAt', new Date());
    state.diffsExist = true;
  },

  setTableSnapshot(state, { schemaName, tableName, data }) {
    const tableIndex = state.all.findIndex(table =>
      table.schema === schemaName &&
      table.name === tableName
    );
    state.all[tableIndex].snapshot = data;
    state.all[tableIndex].snapshotCreated = new Date();
    state.snapshotsExist = true;
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

  setCurrentRowKey(state, { key }) {
    Vue.set(state.current, 'rowKey', key);
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
    state.snapshotsExist = false;
    state.diffsExist = false;
  },
};
