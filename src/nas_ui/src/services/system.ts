import request from '@/utils/request';
import * as System from '@/types/system';
import { ListRes, ListReq, StatusOk } from '@/types/common';

// 获取当前用户信息
const getAccountInfoApi = '/v1/user/info/';

export const getAccountInfo = () =>
  request<System.AccountInfo>(getAccountInfoApi, {
    method: 'GET',
  });

// 修改当前用户密码
const changeAccountPasswordApi = '/v1/user/passwd/';

export const changeAccountPassword = (params: System.AccountPassword) =>
  request<StatusOk>(changeAccountPasswordApi, {
    method: 'PUT',
    body: params,
  });

// 编辑当前用户信息
const editAccountInfoApi = '/v1/user/';

export const editAccountInfo = (params: System.EditAccountInfo) =>
  request<StatusOk>(editAccountInfoApi, {
    method: 'PUT',
    body: params,
  });

// 获取用户列表信息
const getUserListApi = '/v1/user/';

export const getUserList = (
  params: ListReq<{ enable: boolean; user_type: number }>,
) =>
  request<ListRes<System.UserListInfo[]>>(getUserListApi, {
    method: 'GET',
    params,
  });

// 添加用户
const addUserApi = '/v1/user/';

export const addUser = (params: System.AddUserInfo) =>
  request<StatusOk>(addUserApi, {
    method: 'POST',
    body: params,
  });

// 删除用户
const deleteUserApi = '/v1/user/';

export const deleteUser = (params: { uids: number[] | undefined }) =>
  request<ListRes<System.UserListInfo[]>>(deleteUserApi, {
    method: 'DELETE',
    body: params,
  });

// 重置用户密码
const resetUserPasswdApi = '/v1/user/reset_passwd/';

export const resetUserPasswd = (params: { uid: number; password: string }) =>
  request<StatusOk>(resetUserPasswdApi, {
    method: 'POST',
    body: params,
  });

// 修改用户登录状态
const updateUserStatusApi = '/v1/user/status/';

export const updateUserStatus = (params: { uid: number; enable: boolean }) =>
  request<StatusOk>(updateUserStatusApi, {
    method: 'PUT',
    body: params,
  });
