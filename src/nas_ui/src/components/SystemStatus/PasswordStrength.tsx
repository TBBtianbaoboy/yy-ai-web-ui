import { Tag } from 'antd';
import React from 'react';

const PasswordStrengthStatus = ({ status }: { status: number | undefined }) => {
  if (status == 1 || status == undefined) {
    return <Tag color="#FF0033">低</Tag>;
  }
  if (status == 2) {
    return <Tag color="#FFFF33">中</Tag>;
  }
  return <Tag color="#00FF00">高</Tag>;
};

export default PasswordStrengthStatus;
