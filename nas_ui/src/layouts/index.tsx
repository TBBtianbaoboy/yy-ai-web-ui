import styles from './index.less';
import React, { Fragment, useEffect, useState } from 'react';
import { Breadcrumb, Button, Dropdown, Layout, Menu, MenuProps } from 'antd';
import { history,useLocation,Link } from 'umi';
import {
  LogoutOutlined,
  InfoCircleTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';
import { Input } from 'antd';
import defaultProps from '../../config/route';

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

function BasicLayout(props: {
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) {

  const [pathname, setPathname] = useState('/asset');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    history.push('/');
  };

  // const uid = (uid_tmp: string | null) => {
  //   if (uid_tmp == '1') return false;
  //   return true;
  // };

  // const hiddenSubMenu = (title: string | undefined) => {
  //   if (title == '用户管理' || title == '日志审计' || title == '主机资产') {
  //     return uid(localStorage.getItem('uid'));
  //   }
  // };

    const settings: ProSettings | undefined = {
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,
  };

console.log("pathname is ",pathname)
  return  pathname !== '/login' ? (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        bgLayoutImgList={[
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            left: 85,
            bottom: 100,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            bottom: -68,
            right: -45,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
            bottom: 0,
            left: 0,
            width: '331px',
          },
        ]}
        {...defaultProps}
        // route={}
        location={{
          pathname,
        }}
        menu={{
          type: 'group',
        }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: '七妮妮',
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return [
            props.layout !== 'side' && document.body.clientWidth > 1400 ? (
              <div
                key="SearchOutlined"
                aria-hidden
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginInlineEnd: 24,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <Input
                  style={{
                    borderRadius: 4,
                    marginInlineEnd: 12,
                    backgroundColor: 'rgba(0,0,0,0.03)',
                  }}
                  prefix={
                    <SearchOutlined
                      style={{
                        color: 'rgba(0, 0, 0, 0.15)',
                      }}
                    />
                  }
                  placeholder="搜索方案"
                  bordered={false}
                />
                <PlusCircleFilled
                  style={{
                    color: 'var(--ant-primary-color)',
                    fontSize: 24,
                  }}
                />
              </div>
            ) : undefined,
            <InfoCircleFilled key="InfoCircleFilled" />,
            <QuestionCircleFilled key="QuestionCircleFilled" />,
            <GithubFilled key="GithubFilled" />,
            <LogoutOutlined key="LogoutOutlined" onClick={() => {
            logout();

            }} />,
          ];
        }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <div
              style={{
                textAlign: 'center',
                paddingBlockStart: 12,
              }}
            >
              <div>© 2021 Made with love</div>
              <div>by Ant Design</div>
            </div>
          );
        }}
        onMenuHeaderClick={()=>{ history.push('/') }} // 点击logo跳转到首页
        menuItemRender={(item, defaultDom) => {
          setPathname(item.path || '/');
          console.log("item is ",item.path)
          return <Link to={item.path}>{defaultDom}</Link> }}
        {...settings}
      >
                <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: '100%',
            minWidth: 1200,
          }}
        >
          <React.StrictMode>{props.children}</React.StrictMode>
        </Content>
      </ProLayout>
    </div>
  ) : (
    props.children
  );
}

export default BasicLayout;
