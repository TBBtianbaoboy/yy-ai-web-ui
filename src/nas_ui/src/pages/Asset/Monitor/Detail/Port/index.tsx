import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Select } from 'antd';
// import { Table, Input, Button, Popover, message, Space, Select } from 'antd';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getPort } from '@/services/agent';
import useUrlState from '@ahooksjs/use-url-state';
import { ListReq } from '@/types/common';
import { PortItem } from '@/types/asset';
import { ColumnsType } from 'antd/lib/table/interface';
import PortStatus from '@/components/PortStatus';
import PortDetail from './PortDetail';
import { port_status, port_type } from '@/utils/constant';

type Qurey = ListReq<{
  port_type?: string;
  port_status?: string;
  //add
  hash_id?: string;
}>;

export default function IndexPage() {
  const [query, setQuery] = useUrlState<Qurey>({ page: 1, page_size: 10 });
  const { data, run } = useRequest(q => getPort(q), {
    manual: true,
    refreshDeps: [query],
  });
  const [portDetails, setPortDetails] = useState<PortItem>();

  useEffect(() => {
    run(query as Qurey);
  }, []);

  // 设置query并发送请求
  const handleChangeQuery = (name: string, value: any) => {
    setQuery({
      [name]: value,
    });
    run({ ...query, [name]: value });
  };

  // table元素与值
  const columns: ColumnsType<PortItem> = [
    {
      title: '端口号',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '端口类型',
      dataIndex: 'port_type',
      key: 'port_type',
    },
    {
      title: '端口状态',
      dataIndex: 'port_status',
      key: 'port_status',
      render: status => <PortStatus status={status} />,
    },
    {
      title: '端口服务',
      dataIndex: 'port_service',
      key: 'port_service',
    },
    {
      title: 'PID',
      dataIndex: 'pid',
      key: 'pid',
    },
    {
      title: '操作',
      key: 'hash_id',
      fixed: 'right',
      render: (_, item) => {
        return (
          <div className={styles.operation}>
            <Button type="link" onClick={() => setPortDetails(item)}>
              详情
            </Button>
          </div>
        );
      },
    },
  ];
  //return
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.options}>
          <span>
            端口类型
            <Select
              options={port_type}
              defaultValue={''}
              onSelect={(v = '') => handleChangeQuery('port_type', v as string)}
            />
          </span>
          <span>
            端口状态
            <Select
              options={port_status}
              defaultValue={''}
              onSelect={(v = '') =>
                handleChangeQuery('port_status', v as string)
              }
            />
          </span>
        </div>
        <div>
          <Input.Search
            placeholder="请输入端口号/端口服务/PID"
            defaultValue={query.search}
            accessKey="enter"
            allowClear
            onSearch={(value: string) => {
              setQuery({ search: value });
              handleChangeQuery('search', value);
            }}
          />
        </div>
      </div>

      <Table
        rowKey="hash_id"
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={data?.results || []}
        // pagination={{
        //     pageSize: query.page_size,
        //     onChange: (page, pageSize) => {
        //         // setQuery({ page: page, page_size: pageSize });
        //         // handleChangeQuery('page', page);
        //     },
        // }}
      ></Table>

      <PortDetail
        data={portDetails}
        onClose={() => setPortDetails(undefined)}
      ></PortDetail>
    </div>
  );
}
