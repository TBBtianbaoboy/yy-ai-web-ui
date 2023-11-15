import React from 'react';
import styles from './index.less';
const AgentOnlineTimeStatus = ({
  status,
  text,
}: {
  status: boolean;
  text?: string;
}) => {
  return <div className={styles.container}>{status ? text : '---'}</div>;
};

export default AgentOnlineTimeStatus;
