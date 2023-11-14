import { editAccountInfo } from '@/services/system';
import { Col, Form, Input, Modal, Row } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import styles from './index.less';

const EditModal = ({
  visible,
  setVisible,
  updateList,
}: {
  visible: undefined | { uid?: number; username?: string };
  setVisible: (v: undefined | { uid?: number; username?: string }) => void;
  updateList: () => void;
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
  }, [visible]);
  //return
  return (
    <Modal
      destroyOnClose
      visible={!!visible}
      okText="确定"
      cancelText="取消"
      title={'编辑账户: ' + `${visible?.username}`}
      onCancel={() => setVisible(undefined)}
      onOk={() => {
        form.validateFields().then(v =>
          editAccountInfo({ ...v, uid: visible?.uid })
            .then(() => updateList())
            .then(() => setVisible(undefined)),
        );
      }}
    >
      <Form form={form}>
        <Row>
          <Col span={8}>账户邮箱</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '账户邮箱不能为空' }]}
            name="email"
            style={{ width: '66%' }}
          >
            <Input />
          </Form.Item>
        </div>
        <div>
          <Row>
            <Col span={8}>联系方式</Col>
          </Row>
          <Form.Item
            rules={[{ len: 11, required: true, message: '联系方式不能为空' }]}
            name="mobile"
            style={{ width: '66%' }}
          >
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditModal;
