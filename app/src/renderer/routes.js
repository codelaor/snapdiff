export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/LandingPage'),
  },
  {
    path: '/connect-page',
    name: 'connect-page',
    component: require('components/ConnectPage'),
  },
  {
    path: '*',
    redirect: '/',
  },
];
