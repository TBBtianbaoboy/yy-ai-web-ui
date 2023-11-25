import { useEffect, useRef, useState } from 'react';
import {
  chatContextApi,
  postGetAllSessionsApi,
  postGetSessionMessagesApi,
  postDeleteSessionMessagesApi,
} from '@/services/chat';
import { GetSessionMessagesDatas, SessionInfo } from '@/types/chat';
import { LOGIN_TOKEN } from '@/utils/constant';
import { fetchEventSource } from '@fortaine/fetch-event-source';
import { MessageData, MessageList } from '@/components/MessageList/MessageList';
import './index.less';
import {
  Typography,
  Layout,
  Input,
  Tooltip,
  Button,
  List,
  Divider,
  Space,
  Modal,
  message,
} from 'antd';
import {
  EditTwoTone,
  CommentOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css'; // 引入antd样式文件
import AddSessionModal from './AddSessionModal';
import SiderListItem from './SiderListItem';
import { useRequest } from 'ahooks'; // useRequest can not be from umi

const { Content, Footer, Sider } = Layout;
const { TextArea } = Input;
const { Title } = Typography;
const { confirm } = Modal;

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
  const [openAddSession, setOpenAddSession] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<SessionInfo | undefined>(
    undefined,
  );
  const [sessionUpdate, setSessionUpdate] = useState<SessionInfo | undefined>(
    undefined,
  );

  const textAreaRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'i' && event.ctrlKey) {
        const textArea = textAreaRef.current;
        if (textArea) {
          textArea.focus();
        }
      }
    };

    // 绑定键盘事件
    document.addEventListener('keydown', handleKeyDown);

    // 清理函数，在组件卸载时移除事件监听
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // 空数组表示仅在组件第一次渲染时添加监听器

  useEffect(() => {
    run();
  }, []);

  const clickItemHandler = (session_id: string) => {
    setCurrentSessionId(session_id);
    postGetSessionMessagesApi({
      session_id: session_id,
    })
      .then(res => {
        setCurrentModel({
          session_id: parseInt(session_id),
          session_name: res.session_name,
          model: res.model,
          temperature: res.temperature,
          max_tokens: res.max_tokens,
        });
        const messages = res.messages.map(
          (message: GetSessionMessagesDatas) => {
            return {
              sender: 'OpenAI',
              avatar:
                'https://avatars.githubusercontent.com/u/53380609?s=200&v=4',
              content: message.content,
              direction: message.role === 'assistant' ? 'left' : 'right',
            };
          },
        );
        setCurrentMessages(() => [...messages]);
      })
      .catch(err => {
        message.error(err.message);
      });
  };

  const updateLastMessageContent = (newContent: string): void => {
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
        msg.data = msg.data === '' ? '\n' : msg.data;
        lastMessage += msg.data;
        updateLastMessageContent(lastMessage);
      },
      onclose() {
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
  };

  const stopChatRequest = () => {
    message.error('暂不支持停止会话');
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout>
        <Sider // 侧边栏会话列表
          width={300}
          style={{
            background: '#ffffff',
            textAlign: 'left',
          }}
        >
          <div // 操作区------
            style={{ padding: '10px 0', textAlign: 'center' }}
          >
            <Button
              type="primary"
              shape="round"
              size="middle"
              style={{ marginRight: '10px' }}
              icon={<CommentOutlined />}
              onClick={() => {
                setOpenAddSession(true);
                setSessionUpdate(undefined);
              }}
            >
              新建对话
            </Button>
          </div>

          <List
            bordered
            style={{
              overflowY: 'scroll', // 优化滚动
              height: '100vh', // 减去按钮和边距所占空间
            }}
            itemLayout="horizontal"
            dataSource={data?.datas || []}
            renderItem={item => (
              <SiderListItem
                item={item}
                currentSessionId={currentSessionId}
                clickItemHandler={clickItemHandler}
                updateListItem={run}
                setCurrentMessages={setCurrentMessages}
                setCurrentModel={setCurrentModel}
                setCurrentSession={setCurrentSessionId}
              />
            )}
          />
        </Sider>
        <Layout style={{ paddingLeft: '12px' }}>
          <Space size={'middle'}>
            <Tooltip title="当前对话正在使用的模型">
              <Title level={4}>{currentModel?.model}</Title>
            </Tooltip>
            {currentModel ? (
              <Tooltip title="修改模型相关的配置">
                {' '}
                <EditTwoTone
                  onClick={() => {
                    setOpenAddSession(true);
                    setSessionUpdate(currentModel);
                  }}
                />{' '}
              </Tooltip>
            ) : null}
          </Space>

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
              <Button
                type="primary"
                className="Button"
                shape="round"
                onClick={() => {
                  confirm({
                    title: '确定要删除吗?',
                    icon: <ExclamationCircleOutlined />,
                    content: '删除后将无法恢复，请谨慎操作。',
                    onOk() {
                      postDeleteSessionMessagesApi({
                        session_id: parseInt(currentSessionId as string),
                      })
                        .catch(err => {
                          message.error(err.message);
                          return;
                        })
                        .then(() => setCurrentMessages(prevMessages => []));
                      message.success('删除成功');
                    },
                  });
                }}
                danger
              >
                <Tooltip title="清空当前会话的所有消息">清空</Tooltip>
              </Button>
              <TextArea
                ref={textAreaRef}
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
                  <Tooltip title="发送 Ctrl+Enter">发送</Tooltip>
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
        visible={openAddSession}
        setVisible={setOpenAddSession}
        updateListItem={run}
        clickItemHandler={clickItemHandler}
        sessionInfo={sessionUpdate}
      />
    </Layout>
  );
}
