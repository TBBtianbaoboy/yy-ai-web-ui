export const LOGIN_TOKEN = 'token';
export const LOGIN_UID = 'uid';
export const LOGIN_USERNAME = 'username';
export const LOGIN_TOKEN_PRIFIX = 'Nas ';

export const ILLEGAL_RES = 'ILLEGAL_RES';

export const port_type = [
  {
    value: '',
    label: '全部',
  },
  {
    value: 'tcp',
    label: 'TCP',
  },
  {
    value: 'tcp6',
    label: 'TCP6',
  },
  {
    value: 'udp',
    label: 'UDP',
  },
  {
    value: 'udp6',
    label: 'UDP6',
  },
];

export const port_status = [
  {
    value: '',
    label: '全部',
  },
  {
    value: 'on',
    label: '监听中',
  },
  {
    value: 'off',
    label: '开放中',
  },
];

export const login_status = [
  {
    value: 0,
    label: '全部',
  },
  {
    value: 1,
    label: '允许登录',
  },
  {
    value: -1,
    label: '禁止登录',
  },
];
export const role_status = [
  {
    value: 0,
    label: '全部',
  },
  {
    value: 1,
    label: '管理员',
  },
  {
    value: 2,
    label: '超级用户',
  },
  {
    value: 3,
    label: '普通用户',
  },
];

export const scanStatus = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '1',
    label: '合规',
  },
  {
    value: '0',
    label: '违规',
  },
];

export const port_direction = [
  {
    value: 0,
    label: '全部',
  },
  {
    value: -1,
    label: '入方向',
  },
  {
    value: 1,
    label: '出方向',
  },
];

// 1 ACCEPT | 0 REHECT | DROP
export const apply_policy_list = [
  {
    value: 1,
    label: '允许',
  },
  {
    value: 0,
    label: '拒绝',
  },
  {
    value: -1,
    label: '丢弃',
  },
];

export const scan_type = [
  {
    value: 0,
    label: '快速扫描',
  },
  {
    value: 1,
    label: '普遍扫描',
  },
  {
    value: 2,
    label: '端口范围扫描',
  },
  {
    value: 3,
    label: '端口扫描',
  },
  {
    value: 4,
    label: '端口服务扫描',
  },
];

export const protocol_type = [
  {
    value: 1,
    label: 'TCP',
  },
  {
    value: 0,
    label: 'UDP',
  },
  {
    value: -1,
    label: 'ICMP',
  },
];
