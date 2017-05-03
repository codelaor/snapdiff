import Vue from 'vue';

const state = {
  database: {
    activeTab: 'Tables',
  },
  table: {
    activeTab: 'Current',
  },
};

const mutations = {
  setDatabaseActiveTab(state, activeTab) {
    Vue.set(state.database, 'activeTab', activeTab);
  },
  setTableActiveTab(state, activeTab) {
    Vue.set(state.table, 'activeTab', activeTab);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
