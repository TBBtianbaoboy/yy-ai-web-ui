import { getFirstScanIpResult } from '@/services/scan';
import * as Scan from '@/types/scan';
import useRequest from '@ahooksjs/use-request';
import {
  CalendarTwoTone,
  DatabaseTwoTone,
  MinusCircleTwoTone,
} from '@ant-design/icons';
import { Button, Divider, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import PathGraph from './components/pathGraph';
import PieGraph from './components/pieGraph';
import styles from './index.less';
import ServiceDetail from './serviceDetails';

const AssetScanIpDetail = (props: {
  location: { query: { scan_id: any; ip: any; option: any } };
}) => {
  // 获取url中的query内容，存入scan_id中
  const { scan_id, ip, option } = props.location.query;
  const [serviceDetails, setServiceDetails] = useState<Scan.ServiceExtraInfo>();
  const [scriptDetails, setScriptDetails] = useState<Scan.ScriptInfo[]>();
  const { TabPane } = Tabs;

  useEffect(() => {
    run({ scan_id: scan_id, ip: ip });
  }, []);

  const { data, run } = useRequest(q => getFirstScanIpResult(q), {
    manual: true,
    onSuccess: res => {
      if (res) {
        // setportname(getkeysArray(res.portfb))
        // setportvalue(getValuesArray(res.portfb))
        // setservicename(getkeysArray(res.servicefb))
        // setservicevalue(getValuesArray(res.servicefb))
      }
      return res;
    },
  });

  function isTraceDisabled(): boolean {
    if ((option & 0x0010) == 0x0010) return false;
    return true;
  }

  function isService(): boolean {
    if ((option & 0x0100) == 0x0100) return false;
    return true;
  }

  function isScript(): boolean {
    if ((option & 0x0001) == 0x0001) return false;
    return true;
  }

  function isOsDisabled(): boolean {
    if ((option & 0x1000) == 0x1000) return false;
    return true;
  }

  function servicetishi(): string {
    if ((option & 0x0100) == 0x0100) return '已开启服务探测';
    return '未开启服务探测';
  }

  function servicetishicolor(): string {
    if ((option & 0x0100) == 0x0100) return 'green';
    return 'red';
  }

  function scripttishi(): string {
    if ((option & 0x0001) == 0x0001) return '已开启脚本探测';
    return '未开启脚本探测';
  }

  function scripttishicolor(): string {
    if ((option & 0x0001) == 0x0001) return 'green';
    return 'red';
  }

  const columns: ColumnsType<Scan.FirstScanIpResultDoc> = [
    {
      title: '端口号',
      dataIndex: 'port_id',
      key: 'port_id',
    },
    {
      title: '协议类型',
      dataIndex: 'protocol',
      key: 'protocol',
    },
    {
      title: '服务名称',
      dataIndex: 'service_name',
      key: 'service_name',
    },
    {
      title: 'TTL',
      dataIndex: 'service_ttl',
      key: 'service_ttl',
    },
    {
      title: '服务状态',
      dataIndex: 'service_state',
      key: 'service_state',
    },
    {
      title: '操作',
      key: 'none',
      fixed: 'right',
      render: (_, item) => {
        return (
          <div className={styles.operation}>
            <Button
              type="link"
              disabled={isService() && isScript()}
              onClick={() => {
                setServiceDetails(item.service_extra_info);
                setScriptDetails(item.script);
              }}
            >
              服务详情
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <CalendarTwoTone />
              端口服务
            </span>
          }
          key="1"
        >
          <Divider orientation="left">
            <font color={servicetishicolor()}>{servicetishi()}</font>
            <MinusCircleTwoTone />
            <font color={scripttishicolor()}>{scripttishi()}</font>
          </Divider>
          <Table
            rowKey="port_id"
            scroll={{ x: 1200 }}
            columns={columns}
            dataSource={data?.port_service_info || []}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <DatabaseTwoTone />
              路由追踪
            </span>
          }
          disabled={isTraceDisabled()}
          key="2"
        >
          <PathGraph
            title={
              '路由追踪依据(端口号: ' +
              data?.trace_port +
              ', 协议类型: ' +
              data?.trace_protocol +
              ')'
            }
            data={data?.trace as string[]}
            result={data?.trace_ttl as number[]}
            id="path1"
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <DatabaseTwoTone />
              系统探测
            </span>
          }
          disabled={isOsDisabled()}
          key="3"
        >
          <PieGraph data={data?.os_guest as Scan.OsGuest[]} id="pie1" />
        </TabPane>
      </Tabs>
      <ServiceDetail
        data={serviceDetails}
        script={scriptDetails}
        isserviceopen={!isService()}
        isscriptopen={!isScript()}
        onClose={() => setServiceDetails(undefined)}
      ></ServiceDetail>
    </div>
  );
};
export default AssetScanIpDetail;
