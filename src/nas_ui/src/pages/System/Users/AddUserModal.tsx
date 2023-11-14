import { addUser } from '@/services/system';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import { useEffect } from 'react';
import styles from './index.less';

const AddUserModal = ({
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
      title="添加用户"
      onCancel={() => setVisible(undefined)}
      onOk={() => {
        form.validateFields().then(v =>
          addUser({ ...v })
            .then(() => updateList())
            .then(() => setVisible(undefined)),
        );
      }}
    >
      <Form form={form}>
        <Row>
          <Col span={8}>用户类型</Col>
          <Col span={8}>用户名</Col>
          <Col span={8}>用户用户邮箱</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '用户类型不能为空' }]}
            name="user_type"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Select
              options={[
                {
                  value: 1,
                  label: '管理员',
                },
                {
                  value: 2,
                  label: '超级用户',
                },
                {
                  value: 3,
                  label: '普通用户',
                },
              ]}
              placeholder="请选择用户类型"
            ></Select>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '用户名不能为空' }]}
            name="username"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: '用户邮箱不能为空' }]}
            name="mail"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Input />
          </Form.Item>
        </div>

        <Row>
          <Col span={8}>联系方式</Col>
          <Col span={8}>密码</Col>
          <Col span={8}>确认密码</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '联系方式不能为空' }]}
            name="mobile"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '密码不能为空' }]}
            name="password"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '确认密码不能为空' }]}
            name="confirm"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Input.Password placeholder="请输入确认密码" />
          </Form.Item>
        </div>
        <Row>
          <Col span={8}>备注信息</Col>
        </Row>
        <div>
          <Form.Item
            rules={[{ required: false }]}
            name="remark"
            style={{ width: '100%' }}
          >
            <TextArea placeholder="仅限500字数以内" maxLength={500} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
