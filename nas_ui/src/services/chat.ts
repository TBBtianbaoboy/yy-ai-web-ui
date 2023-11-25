import request from '@/utils/request';
import * as Chat from '@/types/chat';
import { StatusOk } from '@/types/common';

const getAllSessionsApi = '/v1/chat/get_all_sessions';
const getSessionMessagesApi = '/v1/chat/get_session_messages';
const deleteSessionMessagesApi = '/v1/chat/session_messages';
const deleteSessionApi = '/v1/chat/delete_context_stream';
const SessionApi = '/v1/chat/session';
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

export const postDeleteSessionMessagesApi = (params: { session_id: number }) =>
  request<StatusOk>(deleteSessionMessagesApi, {
    method: 'DELETE',
    body: JSON.stringify(params),
  });

export const postDeleteSessionApi = (params: Chat.DeleteSessionReq) =>
  request<StatusOk>(deleteSessionApi, {
    method: 'DELETE',
    body: JSON.stringify(params),
  });

export const postAddSessionApi = (params: Chat.AddSessionReq) =>
  request<Chat.AddessionResp>(SessionApi, {
    method: 'POST',
    body: JSON.stringify(params),
  });

export const postUpdateSessionApi = (params: Chat.UpdateSessionReq) =>
  request<Chat.AddessionResp>(SessionApi, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
