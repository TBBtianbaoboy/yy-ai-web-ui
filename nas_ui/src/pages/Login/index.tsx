import styles from './index.less';
import user from '@/asserts/image/icon/user.svg';
import password from '@/asserts/image/icon/password.svg';
import { Button, Form, Input } from 'antd';
import { history } from 'umi';
import { useRequest } from 'ahooks';
import { getValidCode, loginIn } from '@/services/login';
import React from 'react';
import { useEffect } from 'react';
import { HomeTwoTone } from '@ant-design/icons';
import {
  LOGIN_UID,
  LOGIN_TOKEN,
  LOGIN_USERNAME,
  LOGIN_TOKEN_PRIFIX,
} from '@/utils/constant';

const { Item } = Form;

export default function IndexPage() {
  // 进入登录页面时，自动发送请求获取验证码
  const { data, run } = useRequest(getValidCode);
  const [form] = Form.useForm();

  // 在进入登录页面时，如果已经登录过，则直接跳转到聊天页面
  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/chat');
    }
  }, []);

  // 当按钮被点击时，发送登录请求
  const SendLoginRequest = () => {
    form.validateFields().then((form_values: any) => {
      loginIn({ ...form_values, capt_id: data?.capt_id }).then(res => {
        if (res && res.enable) {
          localStorage.setItem(
            LOGIN_TOKEN,
            LOGIN_TOKEN_PRIFIX + res.authorization,
          );
          localStorage.setItem(LOGIN_UID, '' + res.uid);
          localStorage.setItem(LOGIN_USERNAME, '' + res.username);
          history.push('/chat');
        }
      });
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.topRightImage}>
        <Button
          className={styles.github}
          icon={<HomeTwoTone />}
          shape='circle'
          size='large'
          title='personal github'
          onClick={() => {
            window.open('https://github.com/TBBtianbaoboy', '_blank');
          }}
        />
      </div>

      <div className={styles.main_bgc}>
        <div className={styles.login_container}>
          <div className={styles.empty}></div>
          <div>
            <Form form={form} style={{ marginTop: 20 }}>
              <Item
                name="username"
                rules={[{ required: true, message: '用户名是必须的' }]}
              >
                <MyInput
                  label={<img className={styles.mr15} src={user}></img>}
                />
              </Item>
              <Item
                name="password"
                rules={[{ required: true, message: '密码是必须的' }]}
              >
                <MyInput
                  type="password"
                  label={<img className={styles.mr15} src={password}></img>}
                />
              </Item>
              <Item
                name="vcode"
                rules={[{ required: true, message: '请填写验证码' }]}
              >
                <ValidCode data={data?.image} run={run} />
              </Item>
              <Item>
                <Button
                  size="large"
                  type="primary"
                  className={styles.button}
                  style={{ marginLeft: 72 }}
                  onClick={SendLoginRequest}
                >
                  登录
                </Button>
              </Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

const MyInput = ({
  onChange,
  value,
  label,
  type,
}: {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  label: React.ReactNode;
  type?: 'password';
}) => (
  <div className={styles.input}>
    {label}
    {type === 'password' ? (
      <Input.Password
        placeholder="请输入密码"
        onChange={onChange}
        value={value}
      ></Input.Password>
    ) : (
      <Input
        placeholder="请输入用户名"
        onChange={onChange}
        value={value}
      ></Input>
    )}
  </div>
);

const ValidCode = ({
  onChange,
  value,
  run,
  data,
}: {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  run: () => void;
  data?: string;
}) => {
  return (
    <div className={styles.input}>
      <Input
        placeholder="请输入验证码"
        style={{ marginLeft: 72, width: 195 }}
        onChange={onChange}
        value={value}
      />
      <img
        className={styles.code}
        onClick={() => {
          run();
        }}
        src={data || ''}
      ></img>
    </div>
  );
};
