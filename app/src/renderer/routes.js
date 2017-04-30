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
    path: '/table/diff',
    name: 'tableDiff',
    component: require('components/TableDiffPage'),
    props: true,
  },
  {
    path: '/database/diffs',
    name: 'databaseDiffs',
    component: require('components/DatabaseDiffsPage'),
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
