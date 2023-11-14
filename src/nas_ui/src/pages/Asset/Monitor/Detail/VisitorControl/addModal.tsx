import { addSecgrp } from '@/services/agent';
import { apply_policy_list, protocol_type } from '@/utils/constant';
import { ArrowRightOutlined } from '@ant-design/icons';
import { AutoComplete, Col, Form, Input, Modal, Row, Select } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import styles from './index.less';

const AddModal = ({
  visible,
  setVisible,
  updateList,
}: {
  visible: false | string;
  setVisible: (v: false | string) => void;
  updateList: () => void;
}) => {
  // <AutoComplete
  //     dropdownClassName="certain-category-search-dropdown"
  //     dropdownMatchSelectWidth={150}
  //     style={{
  //         width: 150,
  //     }}
  //     options={portOption}
  // >
  //     <Input.Search type='number' max={65535} min={0} placeholder="请输入端口号" />
  // </AutoComplete>
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
  }, [visible]);

  const renderCidr = (value: string) => ({
    value: value,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>
          <ArrowRightOutlined />
        </span>
        {value}
      </div>
    ),
  });

  const renderPort = (desc: string, value: number) => ({
    value: value,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {desc}
        <span>
          <ArrowRightOutlined />
        </span>
        {value}
      </div>
    ),
  });

  const cidrOption = [
    {
      label: 'CIDR blocks',
      options: [
        renderCidr('0.0.0.0/0'),
        renderCidr('10.0.0.0/8'),
        renderCidr('172.16.0.0/12'),
        renderCidr('192.168.0.0/16'),
      ],
    },
  ];

  const portOption = [
    {
      label: '常用端口',
      options: [
        renderPort('SSH', 22),
        renderPort('telnet', 23),
        renderPort('HTTP', 80),
        renderPort('HTTPS', 443),
        renderPort('MySQL', 3306),
        renderPort('Redis', 6379),
      ],
    },
  ];
  //return
  return (
    <Modal
      destroyOnClose
      visible={!!visible}
      okText="确定"
      cancelText="取消"
      title="新建规则"
      onCancel={() => setVisible(false)}
      onOk={() => {
        form.validateFields().then(v =>
          addSecgrp({ ...v, agent_id: visible })
            .then(() => updateList())
            .then(() => setVisible(false)),
        );
      }}
    >
      <Form form={form}>
        <Row>
          <Col span={8}>授权策略</Col>
          <Col span={16}>授权对象</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '授权策略不能为空' }]}
            name="apply_policy"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Select
              placeholder="请选择授权策略"
              options={apply_policy_list}
            ></Select>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '授权对象不能为空' }]}
            name="cidr"
            style={{ width: '66%' }}
          >
            <AutoComplete
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={300}
              style={{
                width: 300,
              }}
              options={cidrOption}
            >
              <Input.Search placeholder="请输入cidr" />
            </AutoComplete>
          </Form.Item>
        </div>

        <Row>
          <Col span={8}>作用方向</Col>
          <Col span={8}>作用端口</Col>
          <Col span={8}>协议类型</Col>
        </Row>
        <div className={styles.flex}>
          <Form.Item
            rules={[{ required: true, message: '作用方向不能为空' }]}
            name="direction"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Select
              options={[
                { label: '入方向', value: -1 },
                { label: '出方向', value: 1 },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '作用端口不能为空' }]}
            name="port"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Input.Search
              type="number"
              max={65535}
              min={0}
              placeholder="请输入端口号"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '协议类型不能为空' }]}
            name="protocol_type"
            style={{ width: '30%', marginRight: '3%' }}
          >
            <Select options={protocol_type} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddModal;
