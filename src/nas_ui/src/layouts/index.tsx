import styles from './index.less';
import React, { Fragment, useEffect, useState } from 'react';
import { Breadcrumb, Button, Dropdown, Layout, Menu, SubMenuProps } from 'antd';
import { history } from 'umi';
import { siderMemu } from '../../config/route';
import { DownOutlined, TagTwoTone, UserOutlined } from '@ant-design/icons';

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
  const [openKey, setOpenKey] = useState<string[]>(['/asset']);
  const {
    location: { pathname },
  } = props;
  const getRouteFather = (pathname: string) => '/' + pathname.split('/')[1];
  useEffect(() => {
    setOpenKey(v => [...v, getRouteFather(pathname)]);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    history.push('/');
  };

  const uid = (uid_tmp: string | null) => {
    if (uid_tmp == '1') return false;
    return true;
  };

  const hiddenSubMenu = (title: string | undefined) => {
    if (title == '用户管理' || title == '日志审计' || title == '主机资产') {
      return uid(localStorage.getItem('uid'));
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Button type="primary" ghost href="/help_center">
          帮助中心
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button type="primary" ghost onClick={logout}>
          退出登录
        </Button>
      </Menu.Item>
      <Menu.Item key="2" hidden={uid(localStorage.getItem('uid'))}>
        <Button type="primary" ghost href="https://www.lengyangyu520.cn/">
          For Blog
        </Button>
      </Menu.Item>
    </Menu>
  );

  const handleOpenChange = (keys: React.Key[]) => {
    const new_keys = keys.map(String);
    setOpenKey(new_keys);
  };

  const breadcrumbs = () => {
    if (pathname === '/') {
      return [];
    }
    const getRoutes = pathname.split('/').filter((txt: string) => txt !== '');
    let nowIndex = 0;
    let nowSearch = [...siderMemu];
    let breadcrumb = [];
    let flag = true;
    if (getRoutes.length > 0) {
      while (nowIndex < getRoutes.length) {
        for (let i = 0; i < nowSearch.length; i++) {
          if (
            !nowSearch[i].noShowInMenu &&
            nowSearch[i].path!.split('/')[nowIndex + 1] === getRoutes[nowIndex]
          ) {
            breadcrumb.push(nowSearch[i]);
            nowSearch = nowSearch[i].routes || [];
            nowIndex++;
            flag = false;
          }
        }
        if (flag) {
          break;
        }
        if (!nowSearch.length) {
          break;
        }
        flag = true;
      }
      return breadcrumb;
    } else return [];
  };
  let username = localStorage.getItem('username');
  const [collapsed, setCollapsed] = useState<true | false>(false);

  return pathname !== '/404' && pathname !== '/login' ? (
    <Layout style={{ minWidth: 1500, minHeight: '100%' }}>
      <Header className={styles.header}>
        <div className="logo"></div>
        <div>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {username} <DownOutlined />
            </a>
          </Dropdown>
        </div>
      </Header>
      <Sider
        width={200}
        className={styles.sider}
        collapsible
        collapsed={collapsed}
        onCollapse={collapsed => {
          setCollapsed(collapsed);
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[]}
          style={{ height: '100%', borderRight: 0 }}
          selectedKeys={pathname}
          openKeys={openKey}
          onOpenChange={handleOpenChange}
        >
          {siderMemu
            .filter(item => !item.noShowInMenu)
            .map((item, index) => {
              const children = item.routes?.filter(item => !item.noShowInMenu);
              return (
                <Fragment key={index}>
                  {children?.length ? (
                    <SubMenu
                      key={item.path}
                      title={item.title}
                      icon={item.icon}
                    >
                      {children.map(item => (
                        <Menu.Item
                          key={item.path}
                          onClick={() => {
                            history.push(item.path!);
                          }}
                          hidden={hiddenSubMenu(item.title)}
                        >
                          {item.title}
                        </Menu.Item>
                      ))}
                    </SubMenu>
                  ) : (
                    <Menu.Item
                      key={item.path}
                      onClick={() => {
                        history.push(item.path!);
                      }}
                    >
                      {item.title}
                    </Menu.Item>
                  )}
                </Fragment>
              );
            })}
        </Menu>
      </Sider>
      <Layout
        style={{ padding: '0 24px 24px', marginLeft: 200, marginTop: 80 }}
      >
        <Breadcrumb>
          {breadcrumbs().map((aaa, index) => {
            const { breadcrumb, path, title } = aaa;
            return index + 1 === breadcrumbs.length ? (
              breadcrumb
            ) : (
              <Breadcrumb.Item key={path} href={path || ''}>
                {breadcrumb || title}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
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
      </Layout>
    </Layout>
  ) : (
    props.children
  );
}

export default BasicLayout;
