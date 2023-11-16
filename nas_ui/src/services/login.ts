import request from '@/utils/request';
import * as Login from '@/types/login';
import { StatusOk } from '@/types/common';

const getCode = '/auth/verifycode/';
const login = '/auth/login/';
const logout = '/auth/logout/';

export const getValidCode = () => request<Login.ValidCode>(getCode, {});

export const loginIn = (params: Login.LoginReq) =>
  request<Login.LoginRes>(login, {
    method: 'POST',
    body: JSON.stringify(params),
  });

export const loginOut = () =>
  request<StatusOk>(logout, {
    method: 'POST',
  });
