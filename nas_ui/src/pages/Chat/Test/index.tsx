import React, { useState } from 'react';
import { postChatTestApi } from '@/services/chat';
import styles from './index.less';
import {
  MenuProps,
  Layout,
  Input,
  Button,
  List,
  Divider,
  Avatar,
  Dropdown,
  Space,
  message,
} from 'antd';
import { UserOutlined, SendOutlined, EditOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; // 引入antd样式文件
import logo from '@/asserts/image/icon/logo.svg';
import Title from 'antd/lib/typography/Title';

const { Content, Footer, Sider } = Layout;

export interface SessionData {
  sessionId: string;
  sessionName: string;
}

export interface MessageData {
  sender: string;
  avatar: string;
  content: string;
  direction: string;
}

const defaultSession: SessionData[] = [
  {
    sessionId: '1',
    sessionName: '张三的对话',
  },
  {
    sessionId: '2',
    sessionName: '李四的对话',
  },
];

// export const session_items: MenuProps['items'] = [
//   {
//     label: '重命名',
//     key: '1',
//   },
//   {
//     label: '删除',
//     key: '2',
//   },
//   {
//     label: '分享',
//     key: '3',
//   },
// ];
// const handleMenuClick: MenuProps['onClick'] = e => {
//   console.log('click', e);
// };
//
// const sessionMenuProps = {
//   session_items,
//   onClick: handleMenuClick,
// };

export default function IndexPage() {
  const [currentMessages, setCurrentMessages] = useState<MessageData[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');

  // 点击发送按钮时触发
  const sendChatRequest = () => {
    if (inputValue === '') {
      message.error('发送内容不能为空');
      return;
    }
    const newMessage: MessageData = {
      sender: 'You',
      avatar: 'https://avatars.githubusercontent.com/u/53380609?s=200&v=4',
      content: inputValue,
      direction: 'right',
    };
    setCurrentMessages(prevMessages => [...prevMessages, newMessage]);
    postChatTestApi({ model_name: 'gpt-4-1106-preview', question: inputValue }).then(
      res => {
        if (res) {
          const newMessage: MessageData = {
            sender: 'OpenAI',
            avatar:
              'https://avatars.githubusercontent.com/u/53380609?s=200&v=4',
            content: res.answer,
            direction: 'left',
          };
          setCurrentMessages(prevMessages => [...prevMessages, newMessage]);
          setInputValue('');
        }
      },
    );
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout>
        <Sider
          width={200}
          style={{ background: '#ffffff', textAlign: 'center' }}
        >
          <Button
            type="primary"
            shape="round"
            size="middle"
            icon={<UserOutlined />}
            style={{ textAlign: 'center', height: '30px' }}
          >
            新建对话
          </Button>
          <List
            bordered
            style={{
              marginTop: '10px',
              textAlign: 'left',
              height: 'calc(100vh)',
              overflow: 'auto',
            }}
            itemLayout="horizontal"
            dataSource={defaultSession}
            renderItem={item => (
              <List.Item
                actions={[
                  // <Dropdown > aaa </Dropdown>,
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setCurrentSessionId(item.sessionId);
                      // setCurrentMessages(map.get(item.sessionId) || []);
                    }}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.sessionName}
                  // style={{ padding: '10px 20px' }}
                  style={{
                    padding: '10px 20px',
                    background:
                      currentSessionId === item.sessionId ? '#e6f7ff' : '',
                  }}
                />
              </List.Item>
            )}
          />
        </Sider>
        <Layout style={{ paddingLeft: '24px' }}>
          <Content // 聊天区
            style={{ padding: '0 24px', minHeight: 280, overflowY: 'scroll' }}
          >
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <h2> 对话区</h2>
              <Divider />
            </div>
            <List
              itemLayout="horizontal"
              locale={{
                emptyText: (
                  <div>
                    <img
                      style={{ marginTop: '100px' }}
                      src={logo}
                      width={100}
                      height={100}
                    ></img>
                    <Title style={{ marginTop: '20px' }} level={4}>
                      我能帮助你什么？
                    </Title>
                  </div>
                ),
              }}
              dataSource={currentMessages}
              renderItem={item => (
                <List.Item
                  style={{
                    justifyContent:
                      item.direction === 'left' ? 'flex-start' : 'flex-end',
                  }}
                >
                  {item.direction === 'left' && <Avatar src={item.avatar} />}
                  <div
                    style={{
                      margin: '0 8px',
                      padding: '10px',
                      borderRadius: '4px',
                      backgroundColor:
                        item.direction === 'left' ? '#f3f3f3' : '#a0d911',
                      color:
                        item.direction === 'left'
                          ? 'rgba(0, 0, 0, 0.65)'
                          : '#fff',
                    }}
                  >
                    {item.content}
                  </div>
                  {item.direction === 'right' && <Avatar src={item.avatar} />}
                </List.Item>
              )}
            />
          </Content>
          <Footer
            style={{ textAlign: 'left', padding: '10px 20px' }}
            hidden={currentSessionId === ''}
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="在此输入你想要咨询的内容, 比如: 李白是谁？有哪些经典的作品？"
                onChange={e => {
                  setInputValue(e.target.value); // 每次输入发生变化时更新
                }}
                value={inputValue}
              />
              <Button
                type="primary"
                onClick={sendChatRequest}
                disabled={inputValue === ''}
              >
                发送
              </Button>
            </Space.Compact>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}
