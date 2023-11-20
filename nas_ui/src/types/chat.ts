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
  messages: GetSessionMessagesDatas[];
}

//-------------------------------------

export interface DeleteSessionReq {
  session_id: number;
}
