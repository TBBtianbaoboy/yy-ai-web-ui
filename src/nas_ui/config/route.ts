import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs';
import menuIcon from './index';

export interface IRoute extends BreadcrumbsRoute {
  group?: boolean;
  path?: string;
  title?: string;
  children?: IRoute[];
  active?: string;
  component?: string;
  breadcrumb?: string | null;
  exclude?: number[];
  noShowInMenu?: boolean;
  routes?: IRoute[];
  redirect?: string;
  exact?: boolean;
  wrappers?: string[];
  icon?: React.ReactNode;
}

export const siderMemu: IRoute[] = [
  //首页登录
  {
    path: '/login',
    component: '@/pages/Login/index',
    noShowInMenu: true,
  },
  // 测试页面
  {
    path: '/test',
    component: '@/pages/Test/index',
    noShowInMenu: true,
  },
  //主页面反向代理
  {
    path: '/',
    redirect: '/asset',
    wrappers: ['@/wrappers/auth'],
    noShowInMenu: true,
    exact: true,
  },
  {
    path: '/asset',
    breadcrumb: '资产',
    title: '资产管理',
    icon: menuIcon(1),
    wrappers: ['@/wrappers/auth'],
    routes: [
      //代理跳转
      {
        path: '/asset',
        redirect: '/asset/web',
        exact: true,
        noShowInMenu: true,
      },
      //主机资产详情路由
      {
        path: '/asset/web/detail',
        title: '主机资产详情',
        component: '@/pages/Asset/Monitor/Detail/index',
        noShowInMenu: true,
        routes: [
          {
            path: '/asset/web/detail',
            redirect: '/asset/web/detail/property',
            noShowInMenu: true,
          },
          {
            path: '/asset/web/detail/property',
            title: '性能监控',
            exact: true,
            component: '@/pages/Asset/Monitor/Detail/Property',
            breadcrumb: '性能监控',
          },
          {
            path: '/asset/web/detail/port',
            exact: true,
            title: '开放端口扫描',
            component: '@/pages/Asset/Monitor/Detail/Port',
            breadcrumb: '开放端口扫描',
          },
          {
            path: '/asset/web/detail/visit',
            exact: true,
            title: '访问控制',
            component: '@/pages/Asset/Monitor/Detail/VisitorControl',
            breadcrumb: '访问控制',
          },
          {
            path: '/asset/web/detail/baseline',
            exact: true,
            title: '基线扫描',
            component: '@/pages/Asset/Monitor/Detail/Baseline',
            breadcrumb: '基线扫描',
          },
        ],
      },
      // 主机资产首页 ok
      {
        path: '/asset/web',
        component: '@/pages/Asset/Monitor/index',
        title: '主机资产',
        exact: true,
        breadcrumb: '主机资产',
      },
      {
        path: '/asset/monitor/:id',
        component: '@/pages/Asset/Monitor/Detail/index',
        noShowInMenu: true,
        title: '资产详情',
      },
      // 网络资产首页
      {
        path: '/asset/scan',
        title: '网络资产',
        component: '@/pages/Asset/Scan/index',
      },
      {
        path: '/asset/scan/detail',
        component: '@/pages/Asset/Scan/Detail/index',
        noShowInMenu: true,
        title: '网络资产详情',
      },
      {
        path: '/asset/scan/detail/target',
        component: '@/pages/Asset/Scan/Detail/Ip/index',
        noShowInMenu: true,
        title: '网络资产IP详情',
      },
    ],
  },
  {
    path: '/config',
    title: '系统配置',
    icon: menuIcon(2),
    routes: [
      {
        path: '/config',
        redirect: '/config/account',
        noShowInMenu: true,
      },
      {
        path: '/config/account',
        component: '@/pages/System/Account/index',
        breadcrumb: '账户信息',
        title: '账户信息',
      },
      {
        path: '/config/users',
        component: '@/pages/System/Users/index',
        breadcrumb: '用户管理',
        title: '用户管理',
      },
      {
        path: '/config/llog',
        component: '@/pages/System/Llog/index',
        breadcrumb: '日志审计',
        title: '日志审计',
      },
    ],
  },
  //帮助中心
  {
    path: '/help_center',
    title: '帮助中心',
    component: '@/pages/Help/index',
    noShowInMenu: true,
  },
  {
    path: '/help_center/agent_use',
    title: 'Agent使用说明',
    component: '@/pages/Help/AgentTeach/index',
    noShowInMenu: true,
  },
  //页面出错
  {
    path: '/404',
    title: '找不到页面',
    component: '@/pages/404',
    noShowInMenu: true,
  },
];
