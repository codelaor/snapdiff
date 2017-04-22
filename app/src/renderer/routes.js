export default [
  {
    path: '/',
    name: 'home',
    component: require('components/pages/HomePage'),
  },
  {
    path: '/table',
    name: 'table',
    component: require('components/pages/TablePage'),
    props: true,
  },
  {
    path: '/diff',
    name: 'diff',
    component: require('components/pages/DiffPage'),
    props: true,
  },
  {
    path: '/database',
    name: 'database',
    component: require('components/pages/DatabasePage'),
  },
  {
    path: '/error',
    name: 'error',
    component: require('components/pages/ErrorPage'),
  },
  {
    path: '*',
    redirect: '/error',
  },
];
