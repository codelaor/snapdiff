export default [
  {
    path: '/',
    name: 'home',
    component: require('components/HomePage'),
  },
  {
    path: '/row',
    name: 'row',
    component: require('components/TableRowPage'),
    props: true,
  },
  {
    path: '/table',
    name: 'table',
    component: require('components/TablePage'),
    props: true,
  },
  {
    path: '/diff',
    name: 'diff',
    component: require('components/DiffPage'),
    props: true,
  },
  {
    path: '/diffs',
    name: 'diffs',
    component: require('components/DiffsPage'),
    props: true,
  },
  {
    path: '/database',
    name: 'database',
    component: require('components/DatabasePage'),
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
