import { resetUserPasswd } from '@/services/system';
import { Col, Form, Space, Input, Modal, Row } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import styles from './index.less';

const ResetPasswdModal = ({
  visible,
  setVisible,
}: {
  visible: undefined | { uid?: number; username?: string };
  setVisible: (v: undefined | { uid?: number; username?: string }) => void;
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
      title="重置用户密码"
      onCancel={() => setVisible(undefined)}
      onOk={() => {
        form
          .validateFields()
          .then(v =>
            resetUserPasswd({ ...v, uid: visible?.uid }).then(() =>
              setVisible(undefined),
            ),
          );
      }}
    >
      <Form form={form}>
        <Row>
          <Col span={8}>{'用户名:   ' + `${visible?.username}`}</Col>
        </Row>

        <Row>
          <Col span={8}>新密码</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '密码不能为空' }]}
            name="password"
            style={{ width: '90%', marginRight: '3%' }}
          >
            <Input.Password
              placeholder="请输入密码"
              defaultValue="lyy40166999"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ResetPasswdModal;
