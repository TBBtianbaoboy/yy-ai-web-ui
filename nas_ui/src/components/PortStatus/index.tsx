import React from 'react';
import styles from './index.less';
const PortStatus = ({ status, text }: { status: boolean; text?: string }) => {
  return (
    <div className={styles.container}>
      <div className={status ? styles.online : styles.fail}></div>
      {text ? text : status ? '监听中' : '开放中'}
    </div>
  );
};

export default PortStatus;
