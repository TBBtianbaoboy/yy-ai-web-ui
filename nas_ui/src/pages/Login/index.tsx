import styles from './index.less';
import { history } from 'umi';
import { useRequest } from 'ahooks';
import { getValidCode, loginIn } from '@/services/login';
import logo from '@/asserts/image/icon/logo.png';
import React from 'react';
import { useEffect } from 'react';
import {
  LOGIN_UID,
  LOGIN_TOKEN,
  LOGIN_USERNAME,
  LOGIN_TOKEN_PRIFIX,
} from '@/utils/constant';
import { LockOutlined, CodeOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useState } from 'react';

type LoginType = 'phone' | 'account';

export default function IndexPage() {
  // 进入登录页面时，自动发送请求获取验证码
  const { data, run } = useRequest(getValidCode);
  const [loginType, setLoginType] = useState<LoginType>('account');

  // 在进入登录页面时，如果已经登录过，则直接跳转到聊天页面
  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/chat');
    }
  }, []);

  return (
    <ProConfigProvider dark>
      <div
        style={{
          backgroundColor: 'white',
          height: '100vh',
        }}
      >
        <LoginFormPage
          logo={logo}
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          title="NAS"
          containerStyle={{
            backgroundColor: 'white',
            backdropFilter: 'blur(4px)',
          }}
          subTitle="AI 在线服务平台，致力于便捷高效地与AI进行交互"
          onFinish={async values => {
            loginIn({ ...values, capt_id: data?.capt_id }).then(res => {
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
          }}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={activeKey => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
          </Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <UserOutlined
                      style={{
                        color: 'rgba(0, 0, 0, 0.2)',
                      }}
                    />
                  ),
                }}
                placeholder={'用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <LockOutlined
                      style={{
                        color: 'rgba(0, 0, 0, 0.2)',
                      }}
                    />
                  ),
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
              <ValidCode run={run} data={data?.image} />
            </>
          )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox
              noStyle
              name="autoLogin"
              style={{ color: 'white' }}
            >
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
}

const ValidCode = ({ run, data }: { run: () => void; data?: string }) => {
  return (
    <div className={styles.input}>
      <ProFormText
        name="vcode"
        fieldProps={{
          size: 'large',
          prefix: (
            <CodeOutlined
              style={{
                color: 'rgba(0, 0, 0, 0.2)',
              }}
            />
          ),
        }}
        placeholder={'验证码'}
        rules={[
          {
            required: true,
            message: '请输入验证码!',
          },
        ]}
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
