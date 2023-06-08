export default {
  /* Bivariate layers */
  ['/active/reports']: {
    target: 'https://disaster.ninja',
    changeOrigin: true,
  },
  ['/active/api']: {
    target: 'https://disaster.ninja',
    changeOrigin: true,
  },
  /* Bivariate layers */
  ['/api/tiles/bivariate']: {
    target: 'https://disaster.ninja/active',
    changeOrigin: true,
  },
  /* For bivariate manager */
  '/tiles/stats': 'https://disaster.ninja',
  /* For Active contributors */
  '/tiles/users': 'https://disaster.ninja',
  /* Hot activations */
  '/tiles/public.hot_projects': 'https://disaster.ninja',
};
