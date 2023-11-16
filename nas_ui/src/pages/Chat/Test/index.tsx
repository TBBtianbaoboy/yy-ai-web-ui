import React from 'react';
import styles from './index.less';
import { Layout, Input, Button, List, Avatar } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; // 引入antd样式文件

const { Header, Content, Footer, Sider } = Layout;
const { TextArea } = Input;

const messages = [
  {
    sender: '张三',
    avatar: 'https://placekitten.com/64/64',
    content: '你好！',
    direction: 'left', // 消息方向，左侧是对方，右侧是自己
  },
  // ... 更多消息对象
];

export default function IndexPage() {
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout>
        <Sider width={200} style={{ background: '#fff', textAlign: "center" }}>
          <Button
            type="primary"
            icon={<UserOutlined />}
            style={{ textAlign: 'center' }}
          >
            新建对话
          </Button>
          <List
            itemLayout="horizontal"
            dataSource={['aaa']} // 此处填入联系人数据
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<a href="javascript:;">{'aaa'}</a>} // 联系人姓名
                  description="最后一条消息" // 最后一条消息概览
                />
              </List.Item>
            )}
          />
        </Sider>
        <Layout style={{ paddingLeft: '24px' }}>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            {/* 消息列表 */}
            <List
              itemLayout="horizontal"
              dataSource={messages}
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
          <Footer style={{ textAlign: 'left', padding: '10px 20px' }}>
            {/* 输入区 */}
            <TextArea rows={4} />
            <Button
              type="primary"
              icon={<SendOutlined />}
              style={{ marginTop: '10px' }}
            >
              发送
            </Button>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}
