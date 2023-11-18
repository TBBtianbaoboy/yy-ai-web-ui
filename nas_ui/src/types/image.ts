export interface ImageGenerateReq {
  model_name: string;
  prompt: string;
  size: string;
  quality: string;
}

export interface ImageGenerateResp {
  base64: string;
}
