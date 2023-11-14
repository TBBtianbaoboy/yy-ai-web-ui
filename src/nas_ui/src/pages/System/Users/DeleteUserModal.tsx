import { deleteUser } from '@/services/system';
import { Form, message, Modal, Row } from 'antd';
import React from 'react';
import { useEffect } from 'react';

const DeleteUserModal = ({
  visible,
  setVisible,
  updateList,
}: {
  visible: undefined | number[];
  setVisible: (v: undefined | number[]) => void;
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
      title="删除用户"
      onCancel={() => setVisible(undefined)}
      onOk={() =>
        deleteUser({ uids: visible })
          .then(() => updateList())
          .then(() => setVisible(undefined))
      }
    >
      <div>
        <Row>是否确认删除以下用户:</Row>
      </div>
      <div>{`{${visible}}`}</div>
    </Modal>
  );
};

export default DeleteUserModal;
