import React, { useState } from 'react';
import { chatDefaultApi } from '@/services/chat';
import { LOGIN_TOKEN } from '@/utils/constant';
import { fetchEventSource } from '@fortaine/fetch-event-source';
import {
  Layout,
  Input,
  Button,
  List,
  Divider,
  Avatar,
  Space,
  message,
} from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
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

export default function IndexPage() {
  const [currentMessages, setCurrentMessages] = useState<MessageData[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');

  const updateLastMessageContent = (newContent: string) => {
    setCurrentMessages(prevMessages => {
      if (prevMessages.length === 0) {
        // 若currentMessages为空，则没有元素可更新
        return prevMessages;
      }
      // 复制当前消息列表
      const updatedMessages = [...prevMessages];
      // 更新最后一个消息元素的内容
      const lastIndex = updatedMessages.length - 1;
      updatedMessages[lastIndex] = {
        ...updatedMessages[lastIndex],
        content: newContent,
      };
      return updatedMessages;
    });
  };

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

    const controller = new AbortController();
    let finished = false;

    const finish = () => {
      if (!finished) {
        finished = true;
      }
    };
    controller.signal.onabort = finish;
    let lastMessage = '';

    fetchEventSource(chatDefaultApi, {
      method: 'POST',
      body: JSON.stringify({
        model_name: 'gpt-4-1106-preview',
        question: inputValue,
      }),
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: '' + localStorage.getItem(LOGIN_TOKEN),
        'Access-Control-Allow-Origin': '*',
      },
      async onopen(res) {
        if (!res.ok || res.status !== 200) {
          if (res.status === 401) {
            message.error('权限不足');
            return finish();
          }
          message.error('发送失败');
          return finish();
        }
        const newMessage: MessageData = {
          sender: 'OpenAI',
          avatar: 'https://avatars.githubusercontent.com/u/53380609?s=200&v=4',
          content: '',
          direction: 'left',
        };
        setCurrentMessages(prevMessages => [...prevMessages, newMessage]);
      },
      onmessage(msg) {
        if (msg.event === 'the end of stream' || finished) {
          return finish();
        }
        lastMessage += msg.data || '\n';
        updateLastMessageContent(lastMessage);
        console.log('[OpenAI] request response data: ', msg.data);
      },
      onclose() {
        setInputValue('');
        finish();
      },
      onerror(e) {
        finish();
        message.error('发送失败');
        throw e;
      },
      openWhenHidden: true,
    });
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
                <List.Item // 每个消息元素
                  style={{
                    justifyContent:
                      item.direction === 'left' ? 'flex-start' : 'flex-end',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
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
                        whiteSpace: 'pre-wrap', // 解析换行符和空格
                        maxWidth: '80%', // 限制内容最大宽度为父容器的80%, 超出部分自动换行
                      }}
                    >
                      {item.content}
                    </div>
                    {item.direction === 'right' && <Avatar src={item.avatar} />}
                  </div>
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
