export default [
  {
    path: '/',
    name: 'home',
    component: require('components/HomePage'),
  },
  {
    path: '/database',
    name: 'database',
    component: require('components/DatabasePage'),
  },
  {
    path: '/table',
    name: 'table',
    component: require('components/TablePage'),
    props: true,
  },
  {
    path: '/row',
    name: 'row',
    component: require('components/RowPage'),
    props: true,
  },
  {
    path: '/error',
    name: 'error',
    component: require('components/ErrorPage'),
  },
  {
    path: '*',
    redirect: '/error',
  },
];
