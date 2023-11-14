import { ElementInfo } from '@/types/scan';
// 弹出侧边框
import { Divider, Drawer, Empty, List } from 'antd';
import React from 'react';

interface IProps {
  data?: ElementInfo[];
  onClose: () => void;
}

const IndexPage: React.FC<IProps> = ({ data, onClose }) => {
  if (data?.length == 0) {
    return (
      <Drawer
        width={'40%'}
        visible={!!data}
        closable={false}
        onClose={onClose}
        placement="right"
        title="脚本检测输出详情"
      >
        <Empty />
      </Drawer>
    );
  }
  return (
    <Drawer
      width={'40%'}
      visible={!!data}
      closable={false}
      onClose={onClose}
      placement="right"
      title="脚本检测输出详情"
    >
      <List
        bordered
        itemLayout="horizontal"
        size="default"
        dataSource={data}
        footer={
          <div>
            <Divider />
          </div>
        }
        renderItem={item => (
          <List.Item key={item.key}>
            <List.Item.Meta title={item.key} />
            {item.value}
          </List.Item>
        )}
      />
    </Drawer>
  );
};

export default IndexPage;
