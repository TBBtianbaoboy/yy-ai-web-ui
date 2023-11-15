import { PortItem } from '@/types/asset';
// 弹出侧边框
import { Drawer } from 'antd';
import styles from './index.less';
import React from 'react';
import { convertTime } from '@/utils/common';
interface IProps {
  data?: PortItem;
  onClose: () => void;
}

const IndexPage: React.FC<IProps> = ({ data, onClose }) => {
  const {
    pid,
    port_process_info: {
      memory_percent,
      cpu_percent,
      cwd,
      username,
      create_time,
      cmdline,
    },
  } = data || { port_process_info: {} };
  return (
    <Drawer width={450} visible={!!data} closable={false} onClose={onClose}>
      <h2>端口服务详情</h2>
      <ul className={styles.list}>
        <li>
          进程号:<span>{pid || ''}</span>
        </li>
        <li>
          运行命令:<span>{cmdline || ''}</span>
        </li>
        <li>
          启动时间:<span>{convertTime(create_time) || ''}</span>
        </li>
        <li>
          所属用户:<span>{username || ''}</span>
        </li>
        <li>
          当前工作目录:<span>{cwd || ''}</span>
        </li>
        <li>
          CPU使用率:<span>{cpu_percent || '-'}%</span>
        </li>
        <li>
          内存使用率:<span>{memory_percent || '-'}%</span>
        </li>
      </ul>
    </Drawer>
  );
};

export default IndexPage;
