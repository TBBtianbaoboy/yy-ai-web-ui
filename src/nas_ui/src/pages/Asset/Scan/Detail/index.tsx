import { getFirstScanResult } from '@/services/scan';
import useRequest from '@ahooksjs/use-request';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  List,
  Row,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import BarGraph from './components/barGraph';
import GaugeGraph from './components/gaugeGraph';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './index.less';
import computer from '../../../../asserts/image/computer.png';
import { history } from 'umi';
import { scan_type } from '@/utils/constant';
import { convertTime, formatTime } from '@/utils/common';

const AssetScanDetail = (props: { location: { query: { scan_id: any } } }) => {
  // 获取url中的query内容，存入scan_id中
  const { scan_id } = props.location.query;
  const [portname, setportname] = useState<string[]>([]);
  const [portvalue, setportvalue] = useState<number[]>([]);
  const [servicename, setservicename] = useState<string[]>([]);
  const [servicevalue, setservicevalue] = useState<number[]>([]);

  const { Panel } = Collapse;

  useEffect(() => {
    run({ scan_id: scan_id });
  }, []);

  const { data, run } = useRequest(q => getFirstScanResult(q), {
    manual: true,
    onSuccess: res => {
      if (res) {
        setportname(getkeysArray(res.portfb));
        setportvalue(getValuesArray(res.portfb));
        setservicename(getkeysArray(res.servicefb));
        setservicevalue(getValuesArray(res.servicefb));
      }
      return res;
    },
  });

  function getkeysArray(
    data: Map<number | string, number> | undefined,
  ): string[] {
    if (data == undefined) return [];
    var result: string[];
    result = Object.keys(data);
    return result;
  }
  function getValuesArray(
    data: Map<number | string, number> | undefined,
  ): any[] {
    if (data == undefined) return [];
    var result: any[];
    result = Object.values(data);
    return result;
  }
  function getscantype(index: number | undefined): string {
    if (index == undefined) return '';
    return scan_type[index].label;
  }
  function convertOption(): number {
    var result: number = 0;
    if (data?.with_os) result |= 0x1000;
    if (data?.with_service) result |= 0x0100;
    if (data?.with_trace) result |= 0x0010;
    if (data?.with_script) result |= 0x0001;
    return result;
  }
  function getoption(): any {
    return (
      <div>
        <Tag color="#f50" hidden={!data?.with_os}>
          OS
        </Tag>
        <Tag color="#2db7f5" hidden={!data?.with_service}>
          Service
        </Tag>
        <Tag color="#87d068" hidden={!data?.with_script}>
          Script
        </Tag>
        <Tag color="#108ee9" hidden={!data?.with_trace}>
          Trace
        </Tag>
      </div>
    );
  }

  const summary = [
    {
      title: '扫描IP域',
      value: data?.ip_domain,
    },
    {
      title: '开始时间',
      value: convertTime(data?.start_time),
    },
    {
      title: '结束时间',
      value: convertTime(data?.end_time),
    },
    {
      title: '深度扫描用时',
      value: formatTime(data?.elapsed),
    },
    {
      title: '扫描类型',
      value: getscantype(data?.scan_type),
    },
    {
      title: '扫描选项',
      value: getoption(),
    },
  ];

  return (
    <div>
      <Row style={{ minWidth: 'auto' }} className={styles.title_border}>
        <h3>扫描结果汇总</h3>
        <Col span={4}>
          <div className={styles.gaugeBox}>
            扫描成功率
            <GaugeGraph
              className={styles.gauge}
              data={data?.rate as number}
              success={data?.count as string}
              all={data?.all as string}
              id="graph3"
            />
          </div>
        </Col>
        <Col>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
            }}
            dataSource={summary}
            renderItem={item => (
              <List.Item>
                <Card title={item.title} style={{ height: 130 }}>
                  {item.value}
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Row style={{ minWidth: 'auto' }}>
        <Col span={12}>
          <div className={styles.graphBox}>
            端口分布图
            <BarGraph
              className={styles.graph}
              xname="端口号"
              xdata={portname}
              ydata={portvalue}
              id="graph1"
            />
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.graphBox}>
            服务分布图
            <BarGraph
              className={styles.graph}
              xname="服务名"
              xdata={servicename}
              ydata={servicevalue}
              id="graph2"
            />
          </div>
        </Col>
      </Row>
      <div className={styles.list_border}>
        <Collapse expandIconPosition="right" bordered>
          <Panel header="已扫描IP列表" key={1}>
            <div
              id="scrollableDiv"
              style={{
                height: 600,
                overflow: 'auto',
                padding: '0 16px',
                border: '1px solid rgba(140, 140, 140, 0.35)',
              }}
            >
              <InfiniteScroll
                dataLength={data?.results.length as number}
                endMessage={<Divider plain>没有更多了 🤐</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  size="small"
                  dataSource={data?.results}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={computer} />}
                        title={
                          <Button
                            type="link"
                            onClick={() =>
                              history.push(
                                `/asset/scan/detail/target/?scan_id=${scan_id}&ip=${
                                  item.ip
                                }&option=${convertOption()}`,
                              )
                            }
                          >
                            {item.ip}
                          </Button>
                        }
                        description={
                          '  ' + item.ip_type + ' ' + item.status_reason
                        }
                      />
                      <div>
                        <Badge text={item.status} status="success" />
                      </div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};
export default AssetScanDetail;
