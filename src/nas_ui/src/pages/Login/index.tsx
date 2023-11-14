import styles from './index.less';
import LoginIcon from '@/asserts/image/loginIcon.jpg';
import title from '@/asserts/image/title.png';
import logo from '@/asserts/image/icon/nas-logo.gif';
import user from '@/asserts/image/icon/user.svg';
import password from '@/asserts/image/icon/password.svg';
import { Button, Form, Input } from 'antd';
import { history } from 'umi';
import { useRequest } from 'ahooks';
import { getValidCode, loginIn } from '@/services/login';
import React from 'react';
import { useEffect } from 'react';
import { GithubFilled } from '@ant-design/icons';
const { Item } = Form;

export default function IndexPage() {
  const { data, run } = useRequest(getValidCode);
  const [form] = Form.useForm();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/asset');
    }
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.topRightImage}>
        <Button
          className={styles.github}
          style={{ backgroundColor: '#160729', border: '#160729' }}
          icon={<GithubFilled />}
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
                  onClick={() => {
                    form.validateFields().then((val: any) => {
                      loginIn({ ...val, capt_id: data?.capt_id }).then(res => {
                        if (res && res.enable) {
                          localStorage.setItem('token', res.authorization);
                          localStorage.setItem('uid', '' + res.uid);
                          localStorage.setItem('username', '' + res.username);
                          history.push('/asset');
                        }
                      });
                    });
                  }}
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
