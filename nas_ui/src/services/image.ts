import request from '@/utils/request';
import * as Image from '@/types/image';

const imageGenerateApi = '/v1/image/generate';

export const postImageGenerateApi = (params: Image.ImageGenerateReq) =>
  request<Image.ImageGenerateResp>(imageGenerateApi, {
    method: 'POST',
    body: JSON.stringify(params),
  });
