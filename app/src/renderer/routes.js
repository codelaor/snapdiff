export default [
  {
    path: '/',
    name: 'home',
    component: require('components/pages/HomePage'),
  },
  {
    path: '/table/:name',
    name: 'table',
    component: require('components/pages/TablePage'),
    props: true,
  },
  {
    path: '/tables',
    name: 'tables',
    component: require('components/pages/TablesPage'),
  },
  {
    path: '*',
    redirect: '/',
  },
];
