export interface GetAllSessionsDatas {
  session_id: number;
  session_name: string;
  create_time: number;
}

export interface GetAllSessionsResp {
  uid: number;
  datas: GetAllSessionsDatas[];
}

//-------------------------------------

export interface GetSessionMessagesDatas {
  role: string;
  content: string;
}

export interface GetSessionMessagesResp {
  uid: number;
  model: string;
  session_name: string;
  max_tokens: number;
  temperature: number;
  messages: GetSessionMessagesDatas[];
  system: string;
}

//-------------------------------------

export interface DeleteSessionReq {
  session_id: number;
}

//-------------------------------------

export interface AddSessionReq {
  session_name: string;
  model: string;
  max_tokens: number;
  temperature: number;
  stop: string[];
  system: string;
}

//-------------------------------------

export interface UpdateSessionReq {
  session_id: number;
  session_name: string;
  model: string;
  max_tokens: number;
  temperature: number;
  stop: string[];
  system: string;
}

//-------------------------------------

export interface AddessionResp {
  session_id: number;
}

export interface UpdateSessionResp {
  session_id: number;
}

export interface SessionInfo {
  session_id: number;
  session_name: string;
  model: string;
  temperature: number;
  max_tokens: number;
  system: string;
}
