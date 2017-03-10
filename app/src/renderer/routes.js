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
    path: '/database',
    name: 'database',
    component: require('components/pages/DatabasePage'),
  },
  {
    path: '*',
    redirect: '/',
  },
];
