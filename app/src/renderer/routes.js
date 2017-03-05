export default [
  {
    path: '/',
    name: 'landing',
    component: require('components/LandingPage'),
  },
  {
    path: '/connect',
    name: 'connect',
    component: require('components/ConnectPage'),
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
