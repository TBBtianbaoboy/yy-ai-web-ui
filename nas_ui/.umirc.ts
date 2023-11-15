import route from './config/route';
import { defineConfig } from 'umi';

export default defineConfig({
  // hash: true,
  antd: {},
  dva: {
    immer: true,
    hmr: true,
  },
  proxy: {
    // '/api': {
    //   target: 'https://nas.lengyangyu520.cn/',
    //   changeOrigin: true,
    //   pathRewrite: { '^/api': '/api' },
    // },
    '/api': {
      target: 'http://127.0.0.1:5252/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  nodeModulesTransform: {
    type: 'none',
  },
  ignoreMomentLocale: true,
  routes: [route.route],
});
