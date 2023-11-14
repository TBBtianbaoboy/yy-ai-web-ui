import { ServiceExtraInfo, ScriptInfo, ElementInfo } from '@/types/scan';
// 弹出侧边框
import { Button, Col, Divider, Drawer, Empty, List, Row, Space } from 'antd';
import styles from './index.less';
import React, { useState } from 'react';
import { ProfileTwoTone } from '@ant-design/icons';
import ElementDetail from './elementDetails';

interface IProps {
  data?: ServiceExtraInfo;
  script?: ScriptInfo[];
  isserviceopen: boolean;
  isscriptopen: boolean;
  onClose: () => void;
}

const IndexPage: React.FC<IProps> = ({
  data,
  script,
  isserviceopen,
  isscriptopen,
  onClose,
}) => {
  const { version, product, method, extra_info, tunnel, cpes } = data || {};

  const [element, setElement] = useState<ElementInfo[]>();

  const DescriptionItem = ({
    title,
    content,
  }: {
    title: any;
    content: any;
  }) => (
    <div className={styles.descwrapper}>
      <p className={styles.desclabel}>{title}:</p>
      {content}
    </div>
  );
  const IconText = ({
    icon,
    text,
    element,
  }: {
    icon: any;
    text: any;
    element: ElementInfo[];
  }) => (
    <Space>
      {React.createElement(icon)}
      <Button type="link" onClick={() => setElement(element)}>
        {text}
      </Button>
    </Space>
  );
  const ScriptCheck = () => {
    if (isscriptopen) {
      return (
        <List
          bordered
          itemLayout="horizontal"
          size="default"
          dataSource={script}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[
                <IconText
                  icon={ProfileTwoTone}
                  text="详情"
                  key="list-vertical-star-o"
                  element={item.elements}
                />,
              ]}
            >
              <List.Item.Meta title={item.id} />
              {item.output}
            </List.Item>
          )}
        />
      );
    }
    return <Empty />;
  };

  const ServiceCheck = () => {
    if (isserviceopen) {
      return (
        <div>
          <Row>
            <Col span={12}>
              <DescriptionItem title="版本号" content={version} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="生产商" content={product} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="探测方法" content={method} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="隧道" content={tunnel} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="额外信息" content={extra_info} />
            </Col>
          </Row>
          <Row>
            <Col>
              <DescriptionItem title="CPE" content={cpes} />
            </Col>
          </Row>
        </div>
      );
    }
    return <Empty />;
  };

  return (
    <Drawer
      height="90%"
      visible={!!data}
      closable={false}
      onClose={onClose}
      placement="top"
      title="端口服务详情"
    >
      <p className={styles.p}>服务探测详情</p>
      <ServiceCheck />
      <Divider />
      <p className={styles.p}>脚本探测详情</p>
      <ScriptCheck />
      <ElementDetail
        data={element}
        onClose={() => setElement(undefined)}
      ></ElementDetail>
    </Drawer>
  );
};

export default IndexPage;
