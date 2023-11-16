import React, { useEffect, useState } from 'react';
import { history,useLocation,Link } from 'umi';
import logo from '../asserts/image/icon/logo.svg';
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
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';
import { Input } from 'antd';
import CustomRoutes from '../../config/route';
import {bgLayoutImgList,appList} from './config';

function BasicLayout(props: {
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) {

  const location = useLocation();
  // const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // const [openKeys, setOpenKeys] = useState<string[]>([]);

    // 根据当前的location设置菜单选中和展开的状态
  // useEffect(() => {
  //   const pathname = location.pathname || '/';
  //   console.log('pathname', pathname);
  //   // 假设你的路由结构是这样的：/some-page/sub-page，此时我们以'/'为分隔符获取所有层级的路由
  //   const paths = pathname.split('/').filter((p) => p);
  //   console.log('paths', paths);
  //
  //   // 新的selectedKeys是当前页面的路由
  //   const newSelectedKeys = [pathname];
  //   // 新的openKeys是所有父级菜单路由
  //   const newOpenKeys = paths.map((_, index, arr) => `/${arr.slice(0, index + 1).join('/')}`);
  //
  //   setSelectedKeys(newSelectedKeys);
  //   setOpenKeys(newOpenKeys);
  //   console.log('selectedKeys', selectedKeys);
  //   console.log('openKeys', openKeys);
  // }, [location]);


  // 处理 SubMenu 展开/关闭事件
  // const onOpenChange = (keys) => {
  //   setOpenKeys(keys);
  // };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    history.push('/');
  };

  const settings: ProSettings | undefined = {
    fixSiderbar: true,
    layout: 'top', // 顶部导航
    splitMenus: true,
  };

  const username = localStorage.getItem('username');
  const pathname = location.pathname || '/';
  return pathname !== '/404' && pathname !== '/login' ? (
    <div
      id="test-pro-layout"
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

      menuItemRender={ (menuItemProps, defaultDom) => {
    if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
      return defaultDom;
    }
    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
  }} // 自定义菜单项渲染
      subMenuItemRender={ (menuItemProps, defaultDom) => {
    if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
      return defaultDom;
    }
    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
  }} // 自定义菜单项渲染

        {...settings}
      >
<PageContainer>
          <ProCard
            style={{
              height: '100vh',
              minHeight: 800,
            }}
          >
          <React.StrictMode>{props.children}</React.StrictMode>
          </ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  ) : (
    props.children
  );
}

export default BasicLayout;
