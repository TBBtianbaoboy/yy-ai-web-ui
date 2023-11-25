import { postAddSessionApi,postUpdateSessionApi } from '@/services/chat';
import { model_list } from '@/utils/constant';
import { DecimalStep } from './DecimalStep';
import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Tooltip,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect } from 'react';
import styles from './index.less';
import { SessionInfo } from '@/types/chat';

const AddSessionModal = ({
  visible,
  setVisible,
  updateListItem,
  clickItemHandler,
  sessionInfo,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
  updateListItem: () => void;
  clickItemHandler: (v: string) => void;
  sessionInfo?: SessionInfo;
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
  }, [visible]);

  let initValue = {
    session_name: '',
    model: model_list[0].value,
    max_tokens: 1024,
    temperature: 1.0,
    system: 'You are a helpful assistant.',
  };
  let isUpdate = false;

  if (typeof sessionInfo !== 'undefined') {
    initValue = {
      session_name: sessionInfo.session_name,
      model: sessionInfo.model,
      max_tokens: sessionInfo.max_tokens,
      temperature: sessionInfo.temperature,
      system: '',
    };
    isUpdate = true;
  }

  // 点击确定按钮触发
  const handleOk = () => {
    form.validateFields().then(v => {
      (isUpdate
        ? postUpdateSessionApi({
            ...v,
            stop: [],
            session_id: sessionInfo?.session_id,
          })
        : postAddSessionApi({
            ...v,
            stop: [],
          })
      )
        .then(res => clickItemHandler(res.session_id.toString()))
        .then(() => updateListItem())
        .then(() => setVisible(false));
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <Modal
      destroyOnClose
      open={visible}
      okText="确定"
      cancelText="取消"
      title="新建对话"
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form form={form}>
        <Row>
          <Col span={8}>会话名称</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '会话名称不能为空' }]}
            name="session_name"
            style={{ width: '100%' }}
            initialValue={initValue.session_name}
          >
            <Input
              placeholder="请给你的会话起个名称，方便选择"
              maxLength={50}
            />
          </Form.Item>
        </div>

        <Row>
          <Col span={12}>
            <Tooltip title="用于生成对话的模型">模型 </Tooltip>
          </Col>
          <Col span={8}>
            <Tooltip title="所有对话的最大长度">最大长度 </Tooltip>
          </Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '请选择模型' }]}
            name="model"
            style={{ width: '46%', marginRight: '3%' }}
            initialValue={initValue.model}
          >
            <Select options={model_list} placeholder="请选择模型"></Select>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '请输入最大长度' }]}
            name="max_tokens"
            style={{ width: '46%', marginRight: '3%' }}
            initialValue={initValue.max_tokens}
          >
            <InputNumber />
          </Form.Item>
        </div>

        <Row>
          <Col span={8}>
            <Tooltip title="生成文本的随机性">Temperature </Tooltip>
          </Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[
              {
                required: true,
                message: '请输入Temperature',
              },
            ]}
            name="temperature"
            style={{ width: '100%' }}
            initialValue={initValue.temperature}
          >
            <DecimalStep />
          </Form.Item>
        </div>
        <Row>
          <Tooltip title="用于预设模型的行为，作用于接下来的所有对话">
            模型系统指令{' '}
          </Tooltip>
        </Row>
        <div>
          <Form.Item
            rules={[{ required: false }]}
            name="system"
            style={{ width: '100%' }}
            initialValue={initValue.system}
          >
            <TextArea
              disabled={isUpdate}
              placeholder="仅限1000字数以内"
              maxLength={1000}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddSessionModal;
