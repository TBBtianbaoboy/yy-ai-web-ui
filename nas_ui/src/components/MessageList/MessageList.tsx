import { ViewMarkdown } from '@/components/MarkDown/CodeBlock';
import logo from '@/asserts/image/icon/logo.svg';
import Title from 'antd/lib/typography/Title';
import { List, Avatar } from 'antd';
import { useRef, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export interface MessageData {
  sender: string; // 消息发送者
  avatar: string; // 消息发送者头像
  content: string; // 消息内容
  direction: string; // 消息方向
}

type messageListProps = {
  currentMessages: MessageData[];
};

export const MessageList = (props: messageListProps) => {
  const { currentMessages } = props;
  // 获取列表容器的引用
  const scrollParentRef = useRef();

  // 定义滚动到底部的函数
  const scrollToBottom = () => {
    if (scrollParentRef.current) {
      const scrollContainer = scrollParentRef.current;
      // 将滚动条位置设置为列表的实际高度
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  // 在数据更新时滚动到底部
  useEffect(() => {
    // 每次数据更新后，滚动到列表底部
    scrollToBottom();
  }, [currentMessages]);

  return (
    <InfiniteScroll
      dataLength={currentMessages.length}
      hasMore={true}
      scrollableTarget="scrollableDiv"
    >
      <div
        id="scrollableDiv"
        style={{ overflow: 'auto', height: '75vh' }}
        ref={scrollParentRef}
      >
        <List
          itemLayout="horizontal"
          locale={{
            // 当 List 中没有元素时显示的内容
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
                    width: 'fit-content', // 限制内容最小宽度为内容的宽度
                  }}
                >
                  <ViewMarkdown textContent={item.content} />
                </div>
                {item.direction === 'right' && <Avatar src={item.avatar} />}
              </div>
            </List.Item>
          )}
        />
      </div>
    </InfiniteScroll>
  );
};
