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
      // 当检测到内容类型为Event Stream时，我们立刻通过`flushHeaders`方法发送目前的HTTP头部，表明之后的数据将会是一个流
      onProxyRes(proxyRes, req, res) {
        if (proxyRes.headers['content-type']) {
          // 检测是不是需要直接传输的内容类型，例如流
          const isStream = /text\/event-stream/.test(
            proxyRes.headers['content-type'],
          );
          if (isStream) {
            // Node.js中禁用缓冲
            res.flushHeaders();
          }
        }
      },
    },
  },
  nodeModulesTransform: {
    type: 'none',
  },
  ignoreMomentLocale: true,
  routes: [route.route],
});
