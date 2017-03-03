export default [
  {
    path: '/',
    name: 'landing-page',
    component: require('components/LandingPageView'),
  },
  {
    path: '/connect-page',
    name: 'connect-page',
    component: require('components/ConnectPageView'),
  },
  {
    path: '*',
    redirect: '/',
  },
];
