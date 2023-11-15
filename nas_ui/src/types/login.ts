export interface ValidCode {
  capt_id: string;
  image: string;
}

export interface LoginReq {
  capt_id: string;
  password: string;
  username: string;
  vcode: string;
}

export interface LoginRes {
  authorization: string;
  enable: boolean;
  uid: number;
  username: string;
}
