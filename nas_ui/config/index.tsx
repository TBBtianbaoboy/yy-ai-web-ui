import { ClusterOutlined, ToolOutlined } from '@ant-design/icons';
import React from 'react';

const menuIcon = (value: number) => {
  if (value == 1) {
    return <ClusterOutlined spin />;
  }
  return <ToolOutlined spin />;
};

export default menuIcon;
