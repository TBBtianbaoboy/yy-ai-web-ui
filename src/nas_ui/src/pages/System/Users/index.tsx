import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Divider, Space, Select } from 'antd';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getUserList } from '@/services/system';
import useUrlState from '@ahooksjs/use-url-state';
import { ListReq } from '@/types/common';
import { UserListInfo } from '@/types/system';
import { ColumnsType } from 'antd/lib/table/interface';
import { Key } from 'react';
import moment from 'moment';
import { login_status, role_status } from '@/utils/constant';
import AddUserModal from './AddUserModal';
import ResetPasswdModal from './ResetPasswdModal';
import EditModal from '../Account/EditModal';
import DeleteUserModal from './DeleteUserModal';
import OnlineStatus from '@/components/SystemStatus/OnlineStatus';
import SystemStatus from '@/components/SystemStatus/SystemStatus';
import { DeleteTwoTone, EditTwoTone, LockTwoTone } from '@ant-design/icons';
import { convertTime } from '@/utils/common';

type Query = ListReq<{
  enable?: boolean;
  user_type?: number;
}>;

export default function IndexPage() {
  const { data, run } = useRequest(q => getUserList(q), { manual: true });
  const [query, setQuery] = useUrlState<Query>({ page: 1, page_size: 10 });
  const [selectKeys, setSelectKeys] = useState<Key[]>([]);
  const [adduser, adduserhandler] = useState<number | undefined>(undefined);
  const [deleteuser, deleteuserhandler] = useState<number[] | undefined>(
    undefined,
  );
  const [edituser, edituserhandler] = useState<
    { uid?: number; username?: string } | undefined
  >(undefined);
  const [resetpasswd, resetpasswdhandler] = useState<
    { uid?: number; username?: string } | undefined
  >(undefined);

  // 设置query并发送请求
  const handleChangeQuery = (name: string, value: any) => {
    setQuery({
      [name]: value,
    });
    run({ ...query, [name]: value });
  };

  useEffect(() => {
    run(query as ListReq<{}>);
  }, []);

  const updateQuery = () => {
    run(query as ListReq<{}>);
  };

  const columns: ColumnsType<UserListInfo> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户ID',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '用户角色',
      dataIndex: 'user_type',
      key: 'user_type',
      render: (_, { user_type }) => {
        return <SystemStatus status={user_type} />;
      },
    },
    {
      title: '登录状态',
      dataIndex: 'enable',
      key: 'enable',
      render: (_, { enable, uid }) => {
        return <OnlineStatus status={enable} uid={uid} />;
      },
    },
    {
      title: '用户邮箱',
      dataIndex: 'mail',
      key: 'mail',
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: create_time => {
        return convertTime(create_time);
      },
    },
    {
      title: '操作',
      key: 'uid',
      fixed: 'right',
      render: (_, { uid, username }) => {
        return (
          <div className={styles.operation}>
            <Space>
              <EditTwoTone
                onClick={() =>
                  edituserhandler({ uid: uid, username: username })
                }
              />
              <DeleteTwoTone onClick={() => deleteuserhandler([uid])} />
              <LockTwoTone
                onClick={() =>
                  resetpasswdhandler({ uid: uid, username: username })
                }
              />
            </Space>
          </div>
        );
      },
    },
  ];
  // 返回的页面
  return (
    <div>
      <div>
        <Divider orientation="left">
          <strong>用户管理</strong>
        </Divider>
      </div>
      <div className={styles.header}>
        <div className={styles.options}>
          <span>
            登录状态
            <Select
              options={login_status}
              defaultValue={0}
              onSelect={(v = 0) => handleChangeQuery('enable', v as number)}
            />
          </span>
          <span>
            用户角色
            <Select
              options={role_status}
              defaultValue={0}
              onSelect={(v = 0) => handleChangeQuery('user_type', v as number)}
            />
          </span>
        </div>
        <div>
          <Input.Search
            placeholder="请输入用户名/邮箱/联系方式"
            defaultValue={query.search}
            allowClear
            accessKey="enter"
            onSearch={(value: string) => {
              setQuery({ search: value });
              handleChangeQuery('search', value);
            }}
          />
        </div>
      </div>

      <div>
        <Space>
          <Button type="primary" onClick={() => adduserhandler(1)}>
            添加用户
          </Button>
          <Button
            type="primary"
            disabled={!selectKeys.length}
            ghost
            onClick={() => deleteuserhandler(selectKeys as number[])}
          >
            批量删除
          </Button>
        </Space>
      </div>
      <Divider />

      <Table
        rowKey="uid"
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={data?.results || []}
        pagination={{
          pageSize: query.page_size,
          total: data?.count,
          onChange: (page, pageSize) => {
            setQuery({ page: page, page_size: pageSize });
            handleChangeQuery('page', page);
          },
        }}
        rowSelection={{
          selectedRowKeys: selectKeys,
          onChange: (keys, _) => setSelectKeys(keys),
        }}
      />
      <AddUserModal
        visible={adduser}
        setVisible={adduserhandler}
        updateList={updateQuery}
      />
      <DeleteUserModal
        visible={deleteuser}
        setVisible={deleteuserhandler}
        updateList={updateQuery}
      />
      <EditModal
        visible={edituser}
        setVisible={edituserhandler}
        updateList={updateQuery}
      />
      <ResetPasswdModal visible={resetpasswd} setVisible={resetpasswdhandler} />
    </div>
  );
}
