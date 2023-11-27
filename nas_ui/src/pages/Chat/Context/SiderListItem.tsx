import { postDeleteSessionApi } from '@/services/chat';
import { MessageData } from '@/components/MessageList/MessageList';
import { GetAllSessionsDatas, SessionInfo } from '@/types/chat';
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
  Typography,
  Space,
  message,
} from 'antd';
import { useEffect } from 'react';
import "./index.less"

const { confirm } = Modal;
const { Text } = Typography;

const SiderListItem = ({
  item,
  currentSessionId,
  clickItemHandler,
  setCurrentModel,
  setCurrentSession,
  setCurrentMessages,
  updateListItem,
}: {
  item: GetAllSessionsDatas;
  currentSessionId: undefined | string;
  clickItemHandler: (v: string) => void;
  setCurrentModel: (v: SessionInfo | undefined) => void;
  setCurrentSession: (v: string) => void;
  setCurrentMessages: (v: MessageData[]) => void;
  updateListItem: () => void;
}) => {
  useEffect(() => {
    updateListItem();
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
                    <Tooltip title="导出(TODO)" placement="left">
                      <ExportOutlined style={{ fontSize: '16px' }} />{' '}
                    </Tooltip>
                  ),
                  style: { textAlign: 'center' },
                },
                {
                  key: '2',
                  label: (
                    <Tooltip title="重命名(TODO)" placement="left">
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
                          .catch(err => {
                            message.error(err.message);
                            return;
                          })
                          .then(() => updateListItem())
                          .then(() => setCurrentMessages(prevMessages => []))
                          .then(() => setCurrentModel(undefined))
                          .then(() => setCurrentSession(''));
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
        borderRadius: '5px', // 增加轮廓圆角
        margin: '2px 0', // 列表项间增加间距
        padding: '10px', // 统一内边距
      }}
      className="list-item"
      onClick={() => {
        clickItemHandler(item.session_id.toString());
      }}
    >
      <List.Item.Meta
        title={<Text strong>{item.session_name}</Text>}
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
