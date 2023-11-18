import { useState } from 'react';
import { postImageGenerateApi } from '@/services/image';
import { LOGIN_TOKEN } from '@/utils/constant';
import { fetchEventSource } from '@fortaine/fetch-event-source';
import { MessageData, MessageList } from '@/components/MessageList/MessageList';
import './index.less';
import { Layout, Input, Button, Divider, Space, message } from 'antd';
import 'antd/dist/antd.css'; // 引入antd样式文件

const { Content, Footer } = Layout;
const { TextArea } = Input;

export default function IndexPage() {
  const [currentMessages, setCurrentMessages] = useState<MessageData[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [imageGenerateFinished, setImageGenerateFinished] = useState(true);

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
  const sendImageGenerateRequest = () => {
    if (inputValue === '') {
      message.error('发送内容不能为空');
      return;
    }
    if (!imageGenerateFinished) {
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
    setImageGenerateFinished(false);

    postImageGenerateApi({
      model_name: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard',
      prompt: input,
    }).then(res => {
      if (res) {
        const newMessage: MessageData = {
          sender: 'OpenAI',
          avatar: 'https://avatars.githubusercontent.com/u/53380609?s=200&v=4',
          content: res.base64,
          direction: 'left',
        };
        setCurrentMessages(prevMessages => [...prevMessages, newMessage]);
        setImageGenerateFinished(true);
      }
    });
  };

  const stopChatRequest = () => {
    message.error('暂不支持停止会话');
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout style={{ paddingLeft: '24px' }}>
        <div // 标题区------
          style={{ textAlign: 'left', padding: '10px 0' }}
        >
          <h3>
            <span>第八区</span>
          </h3>
          <Divider />
        </div>
        <Content // 聊天区------
          style={{
            padding: '0 24px',
            minHeight: 280,
            border: '2px solid #eee000',
            borderRadius: '10px',
            height: '80vh',
          }}
        >
          <MessageList currentMessages={currentMessages} type="image" />
        </Content>
        <Footer // 输入区------
          style={{ textAlign: 'left', padding: '10px 20px' }}
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
                  sendImageGenerateRequest();
                }
              }}
              value={inputValue}
            />
            {imageGenerateFinished ? (
              <Button
                type="primary"
                className="Button"
                shape="round"
                onClick={sendImageGenerateRequest}
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
  );
}
