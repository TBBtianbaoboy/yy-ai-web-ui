import React from 'react';
import styles from './index.less';
const AgentStatus = ({ status, text }: { status: boolean, text?: string }) => {
  return (
    <div className={styles.container}>
      <div className={status ? styles.online : styles.fail}></div>
      {text ? text : status ? '运行中' : '离线中'}
    </div>
  );
};

export default AgentStatus;
