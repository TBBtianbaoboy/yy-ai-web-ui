import { changeAccountPassword } from '@/services/system';
import { Col, Form, Input, Modal, Row } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import styles from './index.less';

const EditModal = ({
  visible,
  setVisible,
  updateList,
}: {
  visible: undefined | number;
  setVisible: (v: undefined | number) => void;
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
      title="修改密码"
      onCancel={() => setVisible(undefined)}
      onOk={() => {
        form.validateFields().then(v =>
          changeAccountPassword({ ...v, uid: visible })
            .then(() => updateList())
            .then(() => setVisible(undefined)),
        );
      }}
    >
      <Form form={form}>
        <Row>
          <Col span={8}>旧密码</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '旧密码不能为空' }]}
            name="old"
            style={{ width: '66%' }}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </div>
        <div>
          <Row>
            <Col span={8}>新密码</Col>
          </Row>
          <Form.Item
            rules={[{ required: true, message: '新密码不能为空' }]}
            name="new"
            style={{ width: '66%' }}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </div>
        <div>
          <Row>
            <Col span={8}>确认新密码</Col>
          </Row>
          <Form.Item
            rules={[{ required: true, message: '确认密码不能为空' }]}
            name="new2"
            style={{ width: '66%' }}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditModal;
