import {
  AudioOutlined,
  FileImageOutlined,
  MessageOutlined,
  StopOutlined,
  SettingOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import React from 'react';

const menuIcon = (value: string | undefined) => {
  if (value === 'chat') {
    return <MessageOutlined />;
  }
  if (value === 'image') {
    return <FileImageOutlined />;
  }
  if (value === 'audio') {
    return <AudioOutlined />;
  }
  if (value === 'config') {
    return <SettingOutlined />;
  }
  if (value === 'help') {
    return <QuestionOutlined />;
  }
  return <StopOutlined />;
};

export default menuIcon;
