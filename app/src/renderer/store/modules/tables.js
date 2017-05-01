import actions from './tables/actions.js';
import getters from './tables/getters.js';
import mutations from './tables/mutations.js';

const state = {
  all: [],
  current: {
    index: -1,
    totalRows: 0,
    rowsPerPage: 10,
    page: 1,
    rows: [],
    rowKey: {},
    showSnapshot: false,
  },
  snapshotsExist: false,
  diffsExist: false,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
