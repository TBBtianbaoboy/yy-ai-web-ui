import React from 'react';
import { Divider, Space, Typography, Modal } from 'antd';
import styles from './index.less';
import help_pic2 from '../../asserts/image/icon/Agent.gif';
import { downloadTmpl } from './DownloadAgent';

export default function IndexPage() {
  const { Text } = Typography;
  // 返回的页面
  return (
    <div>
      <div>
        <Divider orientation="left">
          <strong>帮助中心</strong>
        </Divider>
      </div>
      <div className={styles.allkuang}>
        <Space>
          <div className={styles.kuang}>
            <Text style={{ marginLeft: 100 }} mark>
              <strong>Agent下载</strong>
            </Text>
            <a
              onClick={() => {
                Modal.confirm({
                  title: '是否确认下载Agent',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () => {
                    downloadTmpl();
                  },
                });
              }}
            >
              <img className={styles.logo} src={help_pic2} />
            </a>
          </div>
          <div className={styles.kuang}>
            <Text style={{ marginLeft: 100 }} mark>
              <strong>Agent使用说明</strong>
            </Text>
            <a href="/help_center/agent_use">
              <img className={styles.logo} src={help_pic2} />
            </a>
          </div>
        </Space>
      </div>
    </div>
  );
}
