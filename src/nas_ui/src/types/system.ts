// 获取账户信息返回值的接口
export interface AccountInfo {
  create_time: number;
  email: string;
  phone: string;
  ps: number;
  uid: number;
  user_type: number;
  username: string;
}

//账户修改密码发送的接口
export interface AccountPassword {
  new: string;
  new2: string;
  old: string;
  uid: number;
}

//账户编辑信息发送的接口
export interface EditAccountInfo {
  mail: string;
  mobile: string;
  uid: number;
}

//获取用户列表信息返回值的接口
export interface UserListInfo {
  create_time: number;
  enable: boolean;
  mail: string;
  mobile: string;
  uid: number;
  user_type: number;
  username: string;
}

//添加用户信息的接口
export interface AddUserInfo {
  confirm: string;
  mail: string;
  mobile: string;
  password: string;
  remark: string;
  user_type: number;
  username: string;
}
