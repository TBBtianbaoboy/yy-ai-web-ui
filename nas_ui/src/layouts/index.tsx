import React, { useEffect, useState } from 'react';
import { history,useLocation,Link } from 'umi';
import logo from '../asserts/image/icon/logo.png';
import {
  LogoutOutlined,
} from '@ant-design/icons';
import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { Input } from 'antd';
import CustomRoutes from '../../config/route';
import {bgLayoutImgList,appList} from './config';

function BasicLayout(props: {
  children: React.ReactNode;
}) {

  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    history.push('/');
  };

  const settings: ProSettings | undefined = {
    fixedHeader: true,
    layout: 'top', // 顶部导航
  };

  const username = localStorage.getItem('username');
  const pathname = location.pathname || '/';
  return pathname !== '/404' && pathname !== '/login' ? (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        bgLayoutImgList={bgLayoutImgList} // 背景图片
        appList={appList} // 应用列表
        {...CustomRoutes} // 自定义路由
        // route={}
        location={location}
        menu={{ type: 'group', }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: username,
        }}
        logo={<img src={logo}></img>} // logo
        title="Net AI"
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
        onMenuHeaderClick={()=>{ history.push('/') }} // 点击logo跳转到首页

      menuItemRender={ (menuItemProps, defaultDom) => {
    if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
      return defaultDom;
    }
    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
  }} // 自定义菜单项渲染
        {...settings}
      >
      <PageContainer breadcrumbRender={false} title={false}>
          <React.StrictMode>{props.children}</React.StrictMode>
        </PageContainer>
      </ProLayout>
    </div>
  ) : (
    props.children
  );
}

export default BasicLayout;
