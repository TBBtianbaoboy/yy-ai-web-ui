import { Switch } from 'antd';
import React from 'react';
import { updateUserStatus } from '@/services/system';

const OnlineStatus = ({ status, uid }: { status: boolean; uid: number }) => {
  if (uid == 1)
    return (
      <Switch
        disabled={true}
        checked={status}
        checkedChildren="允许"
        unCheckedChildren="禁止"
      />
    );
  return (
    <Switch
      disabled={false}
      defaultChecked={status}
      checkedChildren="允许"
      unCheckedChildren="禁止"
      onChange={() => updateUserStatus({ uid: uid, enable: status })}
    />
  );
};

export default OnlineStatus;
