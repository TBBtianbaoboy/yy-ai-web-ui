import React from 'react';
import styles from './AgentStatus/index.less';

const STATUS_MAP = {
  '-1': { name: styles.scan_fail, label: '扫描失败' },
  '0': { name: styles.scan, label: '正在扫描' },
  '1': { name: styles.scaned, label: '扫描成功' },
};
const ScanStatus = ({ status }: { status: boolean }) => {
  if (status == true) {
    return <div className={STATUS_MAP['1'].name}>{STATUS_MAP['1'].label}</div>;
  }
  return <div className={STATUS_MAP['0'].name}>{STATUS_MAP['0'].label}</div>;
};

export default ScanStatus;
