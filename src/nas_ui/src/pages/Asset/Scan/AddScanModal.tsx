import { addScan } from '@/services/agent';
import { scan_type } from '@/utils/constant';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import styles from './index.less';

const AddScanModal = ({
  visible,
  setVisible,
  updateList,
}: {
  visible: false | number;
  setVisible: (v: false | number) => void;
  updateList: () => void;
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
  }, [visible]);
  const [isshow, setisshow] = useState<false | true>(true);
  const [placeholder, setplaceholder] = useState<undefined | string>(undefined);

  //return
  return (
    <Modal
      destroyOnClose
      visible={!!visible}
      okText="确定"
      cancelText="取消"
      title="新建扫描"
      onCancel={() => setVisible(false)}
      onOk={() => {
        form.validateFields().then(v =>
          addScan({ ...v })
            .then(() => updateList())
            .then(() => setVisible(false)),
        );
      }}
    >
      <Form form={form}>
        <Row>
          <Col span={8}>扫描域</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '扫描域不能为空' }]}
            name="scan_ip"
            style={{ width: '100%' }}
          >
            <Input placeholder="such as 47.117.1.0/24" />
          </Form.Item>
        </div>

        <Row>
          <Col span={8}>扫描类型</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '扫描类型不能为空' }]}
            name="scan_type"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Select
              placeholder="请选择扫描类型"
              onSelect={(value: number) => {
                if (value == 0 || value == 1) setisshow(true);
                else setisshow(false);
                if (value == 2) setplaceholder('请输入端口范围');
                else if (value == 3) setplaceholder('请输入端口');
                else if (value == 4) setplaceholder('请输入端口服务');
              }}
              options={scan_type}
            ></Select>
          </Form.Item>
          <Form.Item
            hidden={isshow}
            rules={[{ required: !isshow, message: '不能为空' }]}
            name="scan_type_message"
            style={{ width: '66%', marginRight: '3%' }}
          >
            <Input placeholder={placeholder} defaultValue={''} />
          </Form.Item>
        </div>

        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: false }]}
            name="is_with_default_script"
            style={{ width: '45%', marginRight: '3%' }}
          >
            <Select
              options={[
                {
                  value: true,
                  label: '开启',
                },
                {
                  value: false,
                  label: '关闭',
                },
              ]}
              placeholder="是否开启脚本探测功能"
            ></Select>
          </Form.Item>

          <Form.Item
            rules={[{ required: false }]}
            name="is_with_os_detection"
            style={{ width: '45%', marginRight: '3%' }}
          >
            <Select
              options={[
                {
                  value: true,
                  label: '开启',
                },
                {
                  value: false,
                  label: '关闭',
                },
              ]}
              placeholder="是否开启系统探测功能"
            ></Select>
          </Form.Item>
        </div>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: false }]}
            name="is_with_service_info"
            style={{ width: '45%', marginRight: '3%' }}
          >
            <Select
              options={[
                {
                  value: true,
                  label: '开启',
                },
                {
                  value: false,
                  label: '关闭',
                },
              ]}
              placeholder="是否开启服务探测功能"
            ></Select>
          </Form.Item>
          <Form.Item
            rules={[{ required: false }]}
            name="is_with_trace_route"
            style={{ width: '45%', marginRight: '3%' }}
          >
            <Select
              options={[
                {
                  value: true,
                  label: '开启',
                },
                {
                  value: false,
                  label: '关闭',
                },
              ]}
              placeholder="是否开启路由探测功能"
            ></Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddScanModal;
