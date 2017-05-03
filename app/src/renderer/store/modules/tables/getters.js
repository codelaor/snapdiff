export default {
  current(state) {
    // Merge props of current table and record from tables into one combined
    // table object
    const table = state.all[state.current.index];
    return Object.assign(table, state.current);
  },
  tablePageCount(state) {
    return Math.ceil(state.current.totalRows / state.current.rowsPerPage);
  },
};
