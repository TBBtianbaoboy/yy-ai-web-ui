import request from '@/utils/request';
import * as Login from '@/types/login';

const getCode = '/auth/verifycode/';
const login = '/auth/login/';

export const getValidCode = () => request<Login.ValidCode>(getCode, {});

export const loginIn = (params: Login.LoginReq) =>
  request<Login.LoginRes>(login, {
    method: 'POST',
    body: JSON.stringify(params),
  });
