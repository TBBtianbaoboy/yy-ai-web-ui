import React, { useEffect, useState } from 'react';
import { Divider, Descriptions } from 'antd';
import { useRequest } from 'ahooks';
import { getAccountInfo } from '@/services/system';
import EditModal from './EditModal';
import ChangePasswdModal from './ChangePasswdModal';
import { ContactsOutlined, EditTwoTone } from '@ant-design/icons';
import AccountRoleStatus from '@/components/SystemStatus/SystemStatus';
import PasswordStrengthStatus from '@/components/SystemStatus/PasswordStrength';
import { convertTime } from '@/utils/common';

export default function IndexPage() {
  const { data, run } = useRequest(() => getAccountInfo(), { manual: true });
  const [visible, setVisible] = useState<
    { uid?: number; username?: string } | undefined
  >(undefined);
  const [uid, changePasswd] = useState<number | undefined>(undefined);

  useEffect(() => {
    run();
  }, []);

  // 返回的页面
  return (
    <div>
      <div>
        <h3>
          <ContactsOutlined />
          账户信息{' '}
          <EditTwoTone
            onClick={() =>
              setVisible({ uid: data?.uid, username: data?.username })
            }
          />
        </h3>
      </div>
      <Divider />
      <Descriptions layout="horizontal" bordered>
        <Descriptions.Item label="账户角色">
          {AccountRoleStatus({ status: data?.user_type })}
        </Descriptions.Item>
        <Descriptions.Item label="账户ID">{data?.uid}</Descriptions.Item>
        <Descriptions.Item label="账户名">{data?.username}</Descriptions.Item>
        <Descriptions.Item label="账户邮箱">{data?.email}</Descriptions.Item>
        <Descriptions.Item label="联系方式">{data?.phone}</Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>
          {convertTime(data?.create_time)}
        </Descriptions.Item>
        <Descriptions.Item label="密码强度">
          {PasswordStrengthStatus({ status: data?.ps })}
          <EditTwoTone onClick={() => changePasswd(data?.uid)} />
        </Descriptions.Item>
      </Descriptions>
      ,
      <EditModal visible={visible} setVisible={setVisible} updateList={run} />
      <ChangePasswdModal
        visible={uid}
        setVisible={changePasswd}
        updateList={run}
      />
    </div>
  );
}
