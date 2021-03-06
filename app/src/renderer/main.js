import Vue from 'vue';
import Electron from 'vue-electron';
import Resource from 'vue-resource';
import Router from 'vue-router';

import App from './App';
import routes from './routes';

import Buefy from 'buefy';
import 'buefy/lib/buefy.css';

import SnapshotLink from './components/buefyTableColumn/SnapshotLink';
import DiffLink from './components/buefyTableColumn/DiffLink';
import TableRowValue from './components/buefyTableColumn/TableRowValue';
import TableRowValueDiff from './components/buefyTableColumn/TableRowValueDiff';
Vue.component('SnapshotLink', SnapshotLink);
Vue.component('DiffLink', DiffLink);
Vue.component('TableRowValue', TableRowValue);
Vue.component('TableRowValueDiff', TableRowValueDiff);

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
