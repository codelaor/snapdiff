export default [
  {
    path: '/',
    name: 'home',
    component: require('components/pages/HomePage'),
  },
  {
    path: '/schema/:schemaName/table/:tableName',
    name: 'schemaTable',
    component: require('components/pages/TablePage'),
    props: true,
  },
  {
    path: '/table/:tableName',
    name: 'table',
    component: require('components/pages/TablePage'),
    props: true,
  },
  {
    path: '/schema/:schemaName/table/:tableName/diff',
    name: 'schemaDiff',
    component: require('components/pages/DiffPage'),
    props: true,
  },
  {
    path: '/table/:tableName/diff',
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
