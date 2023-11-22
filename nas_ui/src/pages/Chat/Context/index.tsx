import { useEffect, useState } from 'react';
import { chatContextApi, postGetAllSessionsApi } from '@/services/chat';
import { LOGIN_TOKEN } from '@/utils/constant';
import { fetchEventSource } from '@fortaine/fetch-event-source';
import { MessageData, MessageList } from '@/components/MessageList/MessageList';
import './index.less';
import { Layout, Input, Button, List, Divider, Space, message } from 'antd';
import { FileAddOutlined, SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; // 引入antd样式文件
import AddSessionModal from './AddSessionModal';
import SiderListItem from './SiderListItem';
import { useRequest } from 'ahooks'; // useRequest can not be from umi

const { Content, Footer, Sider } = Layout;
const { TextArea } = Input;

export default function IndexPage() {
  const { data, run } = useRequest(() => postGetAllSessionsApi(), {
    manual: true,
  });
  const [currentMessages, setCurrentMessages] = useState<MessageData[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    '',
  );
  const [inputValue, setInputValue] = useState('');
  const [chatFinished, setChatFinished] = useState(true);
  const [addSession, addSessionHandler] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    run();
  }, []);

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
    if (!chatFinished) {
      message.error('请等待上一条消息处理完成');
      return;
    }
    const input = inputValue;
    const newMessage: MessageData = {
      sender: 'You',
      avatar: 'https://avatars.githubusercontent.com/u/53380609?s=200&v=4',
      content: input,
      direction: 'right',
    };
    setCurrentMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');

    const controller = new AbortController();
    let finished = false;

    const finish = () => {
      if (!finished) {
        finished = true;
      }
    };
    controller.signal.onabort = finish;
    let lastMessage = '';

    fetchEventSource(chatContextApi, {
      method: 'POST',
      body: JSON.stringify({
        model_name: 'gpt-3.5-turbo-1106',
        question: input,
        session_id: parseInt(currentSessionId as string),
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
        setChatFinished(false);
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
        console.log('close');
        setChatFinished(true);
        finish();
      },
      onerror(e) {
        setChatFinished(true);
        finish();
        message.error('发送失败');
        throw e;
      },
      openWhenHidden: true,
    });
    console.log('finished');
  };

  const stopChatRequest = () => {
    message.error('暂不支持停止会话');
  };
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout>
        <Sider // 侧边栏会话列表
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={300}
          style={{
            background: '#ffffff',
            textAlign: 'left',
          }}
        >
          <List
            bordered
            style={{
              overflowY: 'scroll', // 优化滚动
              height: 'calc(100vh - 90px)', // 减去按钮和边距所占空间
            }}
            itemLayout="horizontal"
            dataSource={data?.datas || []}
            renderItem={item => (
              <SiderListItem
                item={item}
                currentSessionId={currentSessionId}
                setCurrentSessionId={setCurrentSessionId}
                setCurrentMessages={setCurrentMessages}
                updateList={run}
              />
            )}
          />
        </Sider>
        <Layout style={{ paddingLeft: '12px' }}>
          <div // 操作区------
            style={{ padding: '10px 0', display: 'flex' }}
          >
            <Button
              type="primary"
              shape="round"
              size="middle"
              style={{ marginRight: '10px' }}
              icon={<FileAddOutlined />}
              onClick={() => addSessionHandler(1)}
            >
              新建对话
            </Button>
            <Button
              type="primary"
              shape="round"
              size="middle"
              icon={<SearchOutlined />}
            >
              参数设置
            </Button>
          </div>
          <Divider />
          <Content // 聊天区------
            style={{
              padding: '0 24px',
              minHeight: 280,
              border: '2px solid #eee000',
              borderRadius: '10px',
              height: '80vh',
            }}
          >
            <MessageList currentMessages={currentMessages} />
          </Content>
          <Footer // 输入区------
            style={{ textAlign: 'left', padding: '10px 20px' }}
            hidden={currentSessionId === ''}
          >
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                placeholder="在此输入你想要咨询的内容，比如：李白是谁？有哪些经典的作品？\n 按下 Ctrl + Enter 发送"
                className="TextArea"
                onChange={e => {
                  setInputValue(e.target.value); // 每次输入发生变化时更新
                }}
                onKeyDown={e => {
                  // 按下 Ctrl + Enter 发送
                  if (e.key === 'Enter' && e.ctrlKey) {
                    sendChatRequest();
                  }
                }}
                value={inputValue}
              />
              {chatFinished ? (
                <Button
                  type="primary"
                  className="Button"
                  shape="round"
                  onClick={sendChatRequest}
                >
                  发送
                </Button>
              ) : (
                <Button
                  type="ghost"
                  className="Button"
                  shape="round"
                  onClick={() => {
                    stopChatRequest();
                  }}
                >
                  停止
                </Button>
              )}
            </Space.Compact>
          </Footer>
        </Layout>
      </Layout>
      <AddSessionModal
        visible={addSession}
        setVisible={addSessionHandler}
        updateList={run}
      />
    </Layout>
  );
}
