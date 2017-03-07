export default [
  {
    path: '/',
    name: 'home',
    component: require('components/HomePage'),
  },
  {
    path: '/table/:name',
    name: 'table',
    component: require('components/TablePage'),
    props: true,
  },
  {
    path: '/tables',
    name: 'tables',
    component: require('components/TablesPage'),
  },
  {
    path: '*',
    redirect: '/',
  },
];
