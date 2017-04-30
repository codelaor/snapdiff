import Vue from 'vue';
import Electron from 'vue-electron';
import Resource from 'vue-resource';
import Router from 'vue-router';

import App from './App';
import routes from './routes';

import Buefy from 'buefy';
import 'buefy/lib/buefy.css';

import SnapshotColumn from './components/SnapshotColumn';
import DiffLinkColumn from './components/DiffLinkColumn';
import TableValueColumn from './components/TableValueColumn';
Vue.component('SnapshotColumn', SnapshotColumn);
Vue.component('DiffLinkColumn', DiffLinkColumn);
Vue.component('TableValueColumn', TableValueColumn);

Vue.use(Buefy, {
  defaultTooltipAnimated: true,
});

Vue.use(Electron);
Vue.use(Resource);
Vue.use(Router);
Vue.config.debug = true;

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

/* eslint-disable no-new */
new Vue({
  router,
  ...App,
}).$mount('#app');
