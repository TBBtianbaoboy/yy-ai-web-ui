import { getPercent } from '@/services/agent';
import useRequest from '@ahooksjs/use-request';
import { Col, Row } from 'antd';
import React, { useState } from 'react';
import DynamicLineGraph from '../components/dynamicLineGraph';
import styles from './index.less';

interface DataItem {
  name: string;
  value: [number, number];
}

const AssetDetail = (props: { location: { query: { hash_id: any } } }) => {
  // 获取url中的query内容，存入hash_id中
  const { hash_id } = props.location.query;
  // 发送请求，并获取返回的内容，存入到data中
  const { data } = useRequest(() => getPercent({ hash_id: hash_id }), {
    onSuccess: res => {
      if (res) {
        setCPUData(CPU => {
          if (CPU.length < 60) return [...CPU, pushCpuData(res.cpu_used)];
          return [...CPU.slice(1), pushCpuData(res.cpu_used)];
        });
        setMemoData(Memo => {
          if (Memo.length < 60) return [...Memo, pushData(res.memory_used)];
          return [...Memo.slice(1), pushData(res.memory_used)];
        });
      }
      return res;
    },
    // 2000ms之后发送请求
    pollingInterval: 2000,
  });
  const [CPUData, setCPUData] = useState<DataItem[]>([]);
  const [memoData, setMemoData] = useState<DataItem[]>([]);
  const { device, fstype, mount_point, options, total, used_percent } =
    data?.disk_info || {};
  const { cpu_core, memory_total } = data || {};

  function pushData(value: number): DataItem {
    const time = new Date();
    return {
      name: `${time.getHours()}时${time.getMinutes()}分${time.getSeconds()}秒,内存占用${Math.round(
        value,
      )}% `,
      value: [time.valueOf(), Math.round(value)],
    };
  }

  function pushCpuData(value: number): DataItem {
    const time = new Date();
    return {
      name: `${time.getHours()}时${time.getMinutes()}分${time.getSeconds()}秒,cpu占用${Math.round(
        value,
      )}% `,
      value: [time.valueOf(), Math.round(value)],
    };
  }
  //return
  return (
    <div>
      <Row style={{ minWidth: 'auto' }} className={styles.title_border}>
        <h3>主磁盘监控</h3>
        <Col span={8}>
          <span>设备名称:</span>
          {device}
        </Col>
        <Col span={8}>
          <span>文件系统类型:</span>
          {fstype}
        </Col>
        <Col span={8}>
          <span>磁盘大小:</span>
          {total}
        </Col>
        <Col span={8}>
          <span>挂载目录:</span>
          {mount_point}
        </Col>
        <Col span={8}>
          <span>其他信息:</span>
          {options}
        </Col>
        <Col span={8}>
          <span>磁盘使用率:</span>
          {used_percent}%
        </Col>
      </Row>
      <Row
        style={{ minWidth: 'auto', marginTop: 'auto' }}
        className={styles.title_border}
      >
        <h3>资源监控</h3>
        <Col span={12}>
          <span>CPU核数:</span>
          {cpu_core}
        </Col>
        <Col span={12}>
          <span>内存总量:</span>
          {memory_total}
        </Col>
      </Row>
      <Row style={{ minWidth: 'auto' }}>
        <Col span={12}>
          <div className={styles.graphBox}>
            CPU使用率
            <DynamicLineGraph
              className={styles.graph}
              data={CPUData}
              id="graph1"
            />
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.graphBox}>
            内存使用率
            <DynamicLineGraph
              className={styles.graph}
              data={memoData}
              id="graph2"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AssetDetail;
