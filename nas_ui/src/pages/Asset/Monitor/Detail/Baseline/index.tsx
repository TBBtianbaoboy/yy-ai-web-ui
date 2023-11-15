import {
  changeBaselineInfo,
  getBaseline,
  reBaselineInfo,
} from '@/services/agent';
import { ListReq } from '@/types/common';
import { useRequest } from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import { Button, Col, Modal, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import styles from './index.less';
import { BaselineResults } from '@/types/asset';
import { ColumnsType } from 'antd/lib/table';
import { scanStatus } from '@/utils/constant';
import BaselineDetail from './BaselineDetail';
import { convertTime } from '@/utils/common';

type Qurey = ListReq<{
  status?: string;
  hash_id?: string;
}>;

const IndexPage = () => {
  const [query, setQuery] = useUrlState<Qurey>({ page: 1, page_size: 10 });
  const { data, run } = useRequest(q => getBaseline(q), { manual: true });

  useEffect(() => {
    updateQuery();
  }, []);

  const { loading, run: reRun } = useRequest(reBaselineInfo, { manual: true });
  const [id, setId] = useState<string | boolean>(false);

  const updateQuery = (a?: Object) => {
    const { hash_id, ...res } = query;
    run({ ...res, agent_id: hash_id, ...a });
  };

  const handleChangeQuery = (name: string, value: string) => {
    setQuery({
      [name]: value,
    });
    updateQuery({ [name]: value });
  };

  const afterClick = (hash_id: string) => {
    reRun({ agent_id: hash_id }, updateQuery);
    //TODO: 在扫描完成之后无法及时更新扫描结果
    updateQuery();
  };

  const columns: ColumnsType<BaselineResults> = [
    {
      title: '扫描项名称',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '扫描结果',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <span className={styles[status + '']}>{status ? '合规' : '违规'}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'port',
      key: 'port',
      render: (_, { status, id, is_ignored }) => (
        <div className={styles.operation}>
          <Button
            disabled={status || is_ignored}
            type="link"
            onClick={() => setId(id)}
          >
            建议
          </Button>

          <div className={styles.divide}></div>
          <Button
            disabled={status}
            hidden={is_ignored}
            onClick={() => {
              Modal.confirm({
                content: '确定忽略吗',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                  changeBaselineInfo({
                    agent_id: query.hash_id,
                    cis_id: id,
                  }).then(() => updateQuery());
                },
              });
            }}
            type="link"
          >
            忽略
          </Button>
          <Button
            hidden={!is_ignored}
            onClick={() => {
              Modal.confirm({
                content: '确定恢复吗',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                  changeBaselineInfo({
                    agent_id: query.hash_id,
                    cis_id: id,
                  }).then(() => updateQuery());
                },
              });
            }}
            type="link"
          >
            恢复
          </Button>
        </div>
      ),
    },
  ];
  //return
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.options}>
          <span>
            扫描结果
            <Select
              options={scanStatus}
              defaultValue={''}
              onSelect={(v = '') => handleChangeQuery('status', v as string)}
            />
          </span>
        </div>
        <div>
          <Button
            loading={loading}
            type="primary"
            onClick={() => afterClick(query.hash_id)}
          >
            扫描
          </Button>
        </div>
      </div>

      <Row style={{ minWidth: 'auto' }} className={styles.title_border}>
        <Col span={3}>扫描结果详情</Col>
        <Col span={21}>
          <Row>
            <Col span={11}>
              <span>开始扫描时间:</span>
              {convertTime(data?.start_time)}
            </Col>
            <Col span={11}>
              <span>扫描结束时间:</span>
              {convertTime(data?.end_time)}
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span>检查项数:</span>
              {data?.count}
            </Col>
            <Col span={8}>
              <span>合规项数:</span>
              {data?.success_count}
            </Col>
            <Col span={8}>
              <span>违规项数:</span>
              {data?.failed_count}
            </Col>
          </Row>
        </Col>
      </Row>

      <Table
        rowKey="hash_id"
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={data?.results || []}
        pagination={{
          pageSize: query.page_size,
          total: data?.display_count,
          showSizeChanger: false,
          onChange: (page, pageSize) => {
            updateQuery({ page, page_size: pageSize });
          },
        }}
      ></Table>
      <BaselineDetail data={id} onClose={() => setId(false)}></BaselineDetail>
    </div>
  );
};

export default IndexPage;
