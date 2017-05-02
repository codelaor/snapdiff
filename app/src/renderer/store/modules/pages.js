import Vue from 'vue';

const state = {
  database: {
    activeTab: 'Tables',
  },
};

const mutations = {
  setDatabaseActiveTab(state, activeTab) {
    Vue.set(state.database, 'activeTab', activeTab);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
