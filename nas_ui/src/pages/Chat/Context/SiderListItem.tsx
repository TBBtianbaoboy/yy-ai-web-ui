import {
  postGetSessionMessagesApi,
  postDeleteSessionApi,
} from '@/services/chat';
import { MessageData } from '@/components/MessageList/MessageList';
import { GetAllSessionsDatas, GetSessionMessagesDatas } from '@/types/chat';
import {
  MoreOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  List,
  Tooltip,
  Modal,
  Menu,
  Dropdown,
  Button,
  Space,
  message,
} from 'antd';
import { useEffect } from 'react';

const { confirm } = Modal;

const SiderListItem = ({
  item,
  currentSessionId,
  setCurrentSessionId,
  setCurrentMessages,
  updateList,
}: {
  item: GetAllSessionsDatas;
  currentSessionId: undefined | string;
  setCurrentSessionId: (v: undefined | string) => void;
  setCurrentMessages: (v: MessageData[]) => void;
  updateList: () => void;
}) => {
  useEffect(() => {
    updateList();
  }, []);

  //return
  return (
    <List.Item
      actions={[
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  key: '1',
                  label: (
                    <Tooltip title="导出" placement="left">
                      <ExportOutlined style={{ fontSize: '16px' }} />{' '}
                    </Tooltip>
                  ),
                  style: { textAlign: 'center' },
                },
                {
                  key: '2',
                  label: (
                    <Tooltip title="重命名" placement="left">
                      <EditOutlined style={{ fontSize: '16px' }} />{' '}
                    </Tooltip>
                  ),
                  style: { textAlign: 'center' },
                },
                {
                  key: '3',
                  label: (
                    <Tooltip title="删除" placement="left">
                      <DeleteOutlined
                        style={{ fontSize: '16px', color: '#ff4d4f' }}
                      />{' '}
                    </Tooltip>
                  ),
                  style: { textAlign: 'center' },
                  onClick: () => {
                    confirm({
                      title: '确定要删除吗?',
                      icon: <ExclamationCircleOutlined />,
                      content: '删除后将无法恢复，请谨慎操作。',
                      onOk() {
                        postDeleteSessionApi({
                          session_id: item.session_id,
                        })
                          .then(() => updateList())
                          .catch(err => {
                            message.error(err.message);
                          });
                        message.success('删除成功');
                      },
                    });
                  },
                },
              ]}
            />
          }
          trigger={['click']}
        >
          <a onClick={e => e.preventDefault()}>
            <Space>
              <MoreOutlined />
            </Space>
          </a>
        </Dropdown>,
      ]}
      style={{
        background:
          currentSessionId === item.session_id.toString() ? '#e6f7ff' : '',
        borderRadius: '4px', // 增加轮廓圆角
        margin: '5px 0', // 列表项间增加间距
        padding: '10px', // 统一内边距
      }}
    >
      <List.Item.Meta
        title={
          <Button
            type="text"
            onClick={() => {
              setCurrentSessionId(item.session_id.toString());
              postGetSessionMessagesApi({
                session_id: item.session_id.toString(),
              })
                .then(res => {
                  const messages = res.messages.map(
                    (message: GetSessionMessagesDatas) => {
                      return {
                        sender: 'OpenAI',
                        avatar:
                          'https://avatars.githubusercontent.com/u/53380609?s=200&v=4',
                        content: message.content,
                        direction:
                          message.role === 'assistant' ? 'left' : 'right',
                      };
                    },
                  );
                  setCurrentMessages(() => [...messages]);
                })
                .catch(err => {
                  message.error(err.message);
                });
            }}
          >
            {item.session_name}
          </Button>
        }
        style={{
          overflow: 'hidden', // 防止文本溢出
          whiteSpace: 'nowrap', // 保持单行文本
          textOverflow: 'ellipsis', // 文本溢出时显示省略号
          width: '100%', // 限制宽度
        }}
      />
    </List.Item>
  );
};

export default SiderListItem;
