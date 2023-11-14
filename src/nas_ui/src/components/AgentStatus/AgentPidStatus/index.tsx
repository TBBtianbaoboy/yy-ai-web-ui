import React from 'react';
import styles from './index.less';
const AgentPidStatus = ({
  status,
  text,
}: {
  status: boolean;
  text?: number;
}) => {
  return <div className={styles.container}>{status ? text : '---'}</div>;
};

export default AgentPidStatus;
