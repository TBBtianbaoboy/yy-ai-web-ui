import React, { useEffect, useState } from 'react';
// import { Table, Modal, Button, Popover, message, Space, Select } from 'antd';
import { Table, Modal, Button, Select } from 'antd';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { deleteSecgrp, getSecgrp } from '@/services/agent';
import useUrlState from '@ahooksjs/use-url-state';
import { ListReq } from '@/types/common';
import { SecgrpItem } from '@/types/asset';
import { ColumnsType } from 'antd/lib/table/interface';
import { port_direction } from '@/utils/constant';
import AddModal from './addModal';
import { convertTime } from '@/utils/common';

type Qurey = ListReq<{
  direction?: number;
  hash_id?: string;
}>;

export default function IndexPage() {
  const [query, setQuery] = useUrlState<Qurey>({ page: 1, page_size: 10 });
  const { data, run } = useRequest(q => getSecgrp(q), {
    manual: true,
    refreshDeps: [query],
  });
  const [visible, setVisible] = useState<false | string>(false);

  useEffect(() => {
    updateList();
  }, []);

  const handleChangeQuery = (name: string, value: number) => {
    setQuery({
      [name]: value,
    });
    const { hash_id, ...res } = query;
    run({ ...res, agent_id: hash_id, [name]: value });
  };
  const updateList = () => {
    const { hash_id, ...res } = query;
    run({ ...res, agent_id: hash_id });
  };

  const columns: ColumnsType<SecgrpItem> = [
    {
      title: '作用方向',
      dataIndex: 'direction',
      key: 'direction',
    },
    {
      title: '授权策略',
      dataIndex: 'apply_policy',
      key: 'apply_policy',
    },
    {
      title: '协议类型',
      dataIndex: 'protocol_type',
      key: 'protocol_type',
    },
    {
      title: '作用端口',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '授权对象',
      dataIndex: 'cidr',
      key: 'cidr',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (_, { create_time }) => {
        return convertTime(create_time);
      },
    },
    {
      title: '操作',
      key: 'rule_id',
      fixed: 'right',
      render: (_, { rule_id }) => {
        return (
          <Button
            type="link"
            onClick={() => {
              Modal.confirm({
                title: '是否确认删除',
                okText: '确定',
                cancelText: '取消',
                onOk: () =>
                  deleteSecgrp({
                    rule_id,
                    agent_id: query.hash_id,
                  }).finally(() => updateList()),
              });
            }}
          >
            删除
          </Button>
        );
      },
    },
  ];
  //TODO : 作用方向的改变无法及时刷新list
  //return
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.options}>
          <span>
            作用方向
            <Select
              options={port_direction}
              defaultValue={0}
              onSelect={(v = 0) => handleChangeQuery('direction', v)}
            />
          </span>

          <Button type="primary" onClick={() => setVisible(query.hash_id)}>
            新建规则
          </Button>
        </div>
        <div />
      </div>

      <Table
        rowKey="rule_id"
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={data?.results || []}
        pagination={{
          pageSize: query.page_size,
          onChange: (page, pageSize) => {
            setQuery({ page, page_size: pageSize });
          },
        }}
      ></Table>

      <AddModal
        visible={visible}
        setVisible={setVisible}
        updateList={updateList}
      />
    </div>
  );
}
