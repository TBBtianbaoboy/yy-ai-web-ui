import request from '@/utils/request';
import * as Chat from '@/types/chat';
import { StatusOk } from '@/types/common';

const getAllSessionsApi = '/v1/chat/get_all_sessions';
const getSessionMessagesApi = '/v1/chat/get_session_messages';
const deleteSessionApi = '/v1/chat/delete_context_stream';
const addSessionApi = '/v1/chat/session';
export const chatDefaultApi = '/api/v1/chat/no_context_stream';
export const chatContextApi = '/api/v1/chat/context_stream';

export const postGetAllSessionsApi = () =>
  request<Chat.GetAllSessionsResp>(getAllSessionsApi, {
    method: 'GET',
  });

export const postGetSessionMessagesApi = (params: { session_id: string }) =>
  request<Chat.GetSessionMessagesResp>(getSessionMessagesApi, {
    method: 'GET',
    params: params,
  });

export const postDeleteSessionApi = (params: Chat.DeleteSessionReq) =>
  request<StatusOk>(deleteSessionApi, {
    method: 'DELETE',
    body: JSON.stringify(params),
  });

export const postAddSessionApi = (params: Chat.AddSessionReq) =>
  request<StatusOk>(addSessionApi, {
    method: 'POST',
    body: JSON.stringify(params),
  });
