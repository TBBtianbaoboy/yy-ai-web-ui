import menuIcon from './index';

export default {
  route: {
    path: '/',
    component: '@/layouts/index',
    routes: [
      //首页登录
      {
        path: '/login',
        component: '@/pages/Login/index',
        name: '登录NAS',
        hideInMenu: true,
      },
      // 测试页面
      {
        path: '/test',
        component: '@/pages/Test/index',
      },
      //主页面反向代理
      {
        path: '/',
        redirect: '/login',
        wrappers: ['@/wrappers/auth'],
        exact: true, // 只有当路径完全匹配时才会触发当前路由
      },
      {
        path: '/asset',
        name: '资产管理',
        icon: menuIcon(1),
        wrappers: ['@/wrappers/auth'],
        routes: [
          //代理跳转
          {
            path: '/asset',
            redirect: '/asset/web',
            exact: true,
          },
          //主机资产详情路由
          {
            path: '/asset/web/detail',
            name: '主机资产详情',
            component: '@/pages/Asset/Monitor/Detail/index',
            routes: [
              {
                path: '/asset/web/detail',
                redirect: '/asset/web/detail/property',
              },
              {
                path: '/asset/web/detail/property',
                name: '性能监控',
                exact: true,
                component: '@/pages/Asset/Monitor/Detail/Property',
              },
              {
                path: '/asset/web/detail/port',
                exact: true,
                name: '开放端口扫描',
                component: '@/pages/Asset/Monitor/Detail/Port',
              },
              {
                path: '/asset/web/detail/visit',
                exact: true,
                name: '访问控制',
                component: '@/pages/Asset/Monitor/Detail/VisitorControl',
              },
              {
                path: '/asset/web/detail/baseline',
                exact: true,
                name: '基线扫描',
                component: '@/pages/Asset/Monitor/Detail/Baseline',
              },
            ],
          },
          // 主机资产首页 ok
          {
            path: '/asset/web',
            component: '@/pages/Asset/Monitor/index',
            name: '主机资产',
            exact: true,
          },
          {
            path: '/asset/monitor/:id',
            component: '@/pages/Asset/Monitor/Detail/index',
            name: '资产详情',
          },
          // 网络资产首页
          {
            path: '/asset/scan',
            name: '网络资产',
            component: '@/pages/Asset/Scan/index',
          },
          {
            path: '/asset/scan/detail',
            component: '@/pages/Asset/Scan/Detail/index',
            name: '网络资产详情',
          },
          {
            path: '/asset/scan/detail/target',
            component: '@/pages/Asset/Scan/Detail/Ip/index',
            name: '网络资产IP详情',
          },
        ],
      },
      {
        path: '/config',
        name: '系统配置',
        icon: menuIcon(2),
        routes: [
          {
            path: '/config',
            redirect: '/config/account',
          },
          {
            path: '/config/account',
            component: '@/pages/System/Account/index',
            name: '账户信息',
          },
          {
            path: '/config/users',
            component: '@/pages/System/Users/index',
            name: '用户管理',
          },
          {
            path: '/config/llog',
            component: '@/pages/System/Llog/index',
            name: '日志审计',
          },
        ],
      },
      //帮助中心
      {
        path: '/help_center',
        name: '帮助中心',
        component: '@/pages/Help/index',
      },
      // {
      //   path: '/help_center/agent_use',
      //   name: 'Agent使用说明',
      //   component: '@/pages/Help/AgentTeach/index',
      // },
      //页面出错
      // {
      //   path: '/404',
      //   name: '找不到页面',
      //   component: '@/pages/404',
      // },
    ],
  },
};
