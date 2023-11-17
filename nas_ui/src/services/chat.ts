import request from '@/utils/request';
import * as Chat from '@/types/chat';

const chatTestApi = '/v1/chat/no_context_no_stream';
export const chatDefaultApi = '/api/v1/chat/no_context_stream';

export const postChatTestApi = (params: Chat.ChatTestReq) =>
  request<Chat.ChatTestResp>(chatTestApi, {
    method: 'POST',
    body: JSON.stringify(params),
  });
