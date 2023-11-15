import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Popover, message, Space } from 'antd';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getAgent, deleteAgent } from '@/services/agent';
import useUrlState from '@ahooksjs/use-url-state';
import { ListReq } from '@/types/common';
import { AssetItem } from '@/types/asset';
import { ColumnsType } from 'antd/lib/table/interface';
import AgentStatus from '@/components/AgentStatus';
import AgentPidStatus from '@/components/AgentStatus/AgentPidStatus';
import AgentOnlineTimeStatus from '@/components/AgentStatus/AgentOnlineTimeStatus';
import { Key } from 'react';
import { history } from 'umi';
import moment from 'moment';
import { convertTime } from '@/utils/common';
// title: 'Name',
// dataIndex: 'name',
// key: 'name',

export default function IndexPage() {
  const { data, run } = useRequest(q => getAgent(q), { manual: true });
  const [query, setQuery] = useUrlState<ListReq<{}>>({
    page: 1,
    page_size: 10,
  });
  const [selectKeys, setSelectKeys] = useState<Key[]>([]);
  const [batchDeleteVisible, setBatchDeleteVisible] = useState(false);

  const { run: runDelete } = useRequest(deleteAgent, {
    manual: true,
    onSuccess: res => {
      if (res) message.success('删除成功');
    },
    refreshDeps: [query],
  });

  useEffect(() => {
    run(query as ListReq<{}>);
  }, []);

  const handlerQuery = (name: string, value: string) => {
    setQuery({
      [name]: value,
    });
    run({ ...query, [name]: value });
  };

  const updateQuery = () => {
    run(query as ListReq<{}>);
  };

  const columns: ColumnsType<AssetItem> = [
    {
      title: '主机IP',
      dataIndex: 'agent_ip',
      key: 'agent_ip',
    },
    {
      title: '主机名',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: 'Agent 状态',
      dataIndex: 'status',
      key: 'status',
      render: status => <AgentStatus status={status} />,
    },
    {
      title: '安装时间',
      dataIndex: 'join_time',
      key: 'join_time',
      render: (_, { join_time }) => {
        return convertTime(join_time);
      },
    },
    {
      title: 'Agent 进程号',
      dataIndex: 'pid',
      key: 'pid',
      render: (_, { pid, status }) => {
        return <AgentPidStatus status={status} text={pid} />;
      },
    },
    {
      title: '上线时间',
      dataIndex: 'update_time',
      key: 'update_time',
      render: (_, { update_time, status }) => {
        return (
          <AgentOnlineTimeStatus
            status={status}
            text={convertTime(update_time)}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'hash_id',
      fixed: 'right',
      render: (_, { hash_id, status }) => {
        return (
          <div className={styles.operation}>
            <Button
              type="link"
              disabled={status}
              onClick={() => {
                Modal.confirm({
                  title: '是否确认删除',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () =>
                    deleteAgent({
                      hash_ids: [hash_id],
                    }).then(() => updateQuery()),
                });
              }}
            >
              删除
            </Button>

            <div className={styles.divide}></div>
            <Button
              type="link"
              disabled={!status}
              onClick={() =>
                history.push(`/asset/web/detail/property/?hash_id=${hash_id}`)
              }
            >
              详情
            </Button>
          </div>
        );
      },
    },
  ];
  // 返回的页面
  return (
    <div>
      <div className={styles.header}>
        <div>
          <Popover
            title="是否确认批量删除"
            overlayClassName={styles.myPopover}
            trigger="click"
            content={
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    runDelete({ hash_ids: selectKeys as string[] });
                  }}
                >
                  确定
                </Button>
              </Space>
            }
            visible={batchDeleteVisible}
            onVisibleChange={v => {
              if (!selectKeys.length) {
                message.error('请先选择Agent');
                return;
              }
              setBatchDeleteVisible(v);
            }}
            placement="bottomLeft"
          >
            <Button type="primary" disabled={!selectKeys.length}>
              删除
            </Button>
          </Popover>
        </div>
        <div>
          <Input.Search
            placeholder="请输入主机IP/主机名"
            defaultValue={query.search}
            allowClear
            accessKey="enter"
            onSearch={(value: string) => {
              setQuery({ search: value });
              handlerQuery('search', value);
            }}
          />
        </div>
      </div>

      <Table
        rowKey="hash_id"
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={data?.results || []}
        pagination={{
          pageSize: query.page_size,
          onChange: (page, pageSize) => {
            setQuery({ page, page_size: pageSize });
          },
        }}
        rowSelection={{
          selectedRowKeys: selectKeys,
          onChange: (keys, _) => setSelectKeys(keys),
        }}
      />
    </div>
  );
}
