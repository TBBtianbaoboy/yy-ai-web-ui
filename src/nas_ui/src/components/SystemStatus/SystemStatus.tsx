import React from 'react';
import styles from './index.less';

const STATUS_MAP = {
  '1': { name: styles.scan_fail, label: '管理员' },
  '2': { name: styles.scaned, label: '超级用户' },
  '3': { name: styles.scan, label: '普通用户' },
};
const AccountRoleStatus = ({ status }: { status: number | undefined }) => {
  if (status == 1) {
    return <div className={STATUS_MAP['1'].name}>{STATUS_MAP['1'].label}</div>;
  }
  if (status == 2) {
    return <div className={STATUS_MAP['2'].name}>{STATUS_MAP['2'].label}</div>;
  }
  if (status == undefined) {
    return <div className={STATUS_MAP['3'].name}>{}</div>;
  }
  return <div className={STATUS_MAP['3'].name}>{STATUS_MAP['3'].label}</div>;
};

export default AccountRoleStatus;
