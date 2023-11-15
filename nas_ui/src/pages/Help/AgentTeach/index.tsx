import React from 'react';
import { Divider, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function IndexPage() {
  // 返回的页面
  return (
    <div>
      <Typography>
        <Divider orientation="center">
          <strong>Agent使用说明</strong>
        </Divider>
        <Title level={2}>介绍</Title>
        <Paragraph>
          <Text strong>TODO</Text>
        </Paragraph>
        <Title level={2}>下载方式</Title>
        <Paragraph>
          <Text code>TODO</Text>
        </Paragraph>
      </Typography>
      ,
    </div>
  );
}
