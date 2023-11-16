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
      //主页面反向代理
      {
        path: '/',
        redirect: '/login',
        exact: true, // 只有当路径完全匹配时才会触发当前路由
      },
      {
        path: '/chat',
        name: 'Chat',
        icon: menuIcon('chat'),
        routes: [
          {
            path: '/chat',
            redirect: '/chat/test',
          },
          {
            path: '/chat/test',
            component: '@/pages/Chat/Test/index',
            name: '测试',
          },
          {
            path: '/chat/no_context',
            component: '@/pages/Chat/NoContext/index',
            name: '默认',
          },
          {
            path: '/chat/context',
            component: '@/pages/Chat/Context/index',
            name: '上下文对话',
          },
        ],
      },
      {
        path: '/image',
        name: 'Image',
        icon: menuIcon('image'),
        routes: [
          {
            path: '/image',
            redirect: '/image/generate',
          },
          {
            path: '/image/generate',
            component: '@/pages/Image/Generate/index',
            name: '生成图片',
          },
          {
            path: '/image/edit',
            component: '@/pages/Image/Edit/index',
            name: '编辑图片',
          },
          {
            path: '/image/variation',
            component: '@/pages/Image/Variation/index',
            name: '变换图片',
          },
        ],
      },
      {
        path: '/audio',
        name: 'Audio',
        icon: menuIcon('audio'),
        routes: [
          {
            path: '/audio',
            redirect: '/audio/tts',
          },
          {
            path: '/audio/tts',
            component: '@/pages/Audio/Tts/index',
            name: '文本转语音',
          },
          {
            path: '/audio/stt',
            component: '@/pages/Audio/Stt/index',
            name: '语音转文本',
          },
        ],
      },
      {
        path: '/config',
        name: '系统配置',
        icon: menuIcon('config'),
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
        icon: menuIcon('help'),
        routes: [
          {
            path: '/help_center/agent_use',
            name: '使用说明',
            component: '@/pages/Help/index',
          },
        ],
      },
      //页面出错
      {
        path: '/404',
        name: '找不到页面',
        component: '@/pages/404',
        hideInMenu: true,
      },
    ],
  },
};
