import React, { useState } from 'react';
import {
  Modal,
  Table,
  Input,
  Button,
  Divider,
  Popover,
  Space,
  message,
} from 'antd';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getScan, deleteScan } from '@/services/agent';
import useUrlState from '@ahooksjs/use-url-state';
import { ListReq } from '@/types/common';
import { useEffect } from 'react';
import { AssetScan } from '@/types/asset';
import { ColumnsType } from 'antd/lib/table/interface';
import ScanStatus from '@/components/ScanStatus';
import { Key } from 'react';
import AddScanModal from './AddScanModal';
import AgentOnlineTimeStatus from '@/components/AgentStatus/AgentOnlineTimeStatus';
import { history } from 'umi';
import { convertTime } from '@/utils/common';

interface ScanQuery extends ListReq<{}> {
  sort?: string;
}

export default function IndexPage() {
  const { data, run } = useRequest(q => getScan(q), { manual: true });
  const [query, setQuery] = useUrlState<ScanQuery>({ page: 1, page_size: 10 });
  const [selectKeys, setSelectKeys] = useState<Key[]>([]);
  const [visible, setVisible] = useState<false | number>(false);
  const [batchDeleteVisible, setBatchDeleteVisible] = useState(false);

  const { run: runDelete } = useRequest(deleteScan, {
    manual: true,
    onSuccess: res => {
      if (res) message.success('删除成功');
    },
    refreshDeps: [query],
  });

  useEffect(() => {
    if (Object.keys(query).length) run(query as ScanQuery);
  }, [query]);

  // 重新获取扫描列表函数
  const updateList = () => {
    run(query);
  };

  let uid: number = parseInt(localStorage.getItem('uid') as string);

  const columns: ColumnsType<AssetScan> = [
    {
      title: '扫描IP域',
      dataIndex: 'scan_ip',
      key: 'scan_ip',
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (_, { start_time }) => {
        return convertTime(start_time);
      },
    },
    {
      title: '扫描类型',
      dataIndex: 'scan_type',
      key: 'scan_type',
    },
    {
      title: '扫描状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, { is_deep_scan_done }) => {
        return <ScanStatus status={is_deep_scan_done} />;
      },
    },

    {
      title: '结束时间',
      dataIndex: 'first_scan_done_time',
      key: 'first_scan_done_time',
      render: (_, { deep_scan_done_time, is_deep_scan_done }) => {
        return (
          <AgentOnlineTimeStatus
            status={is_deep_scan_done}
            text={convertTime(deep_scan_done_time)}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'hash_id',
      fixed: 'right',
      render: (_, { scan_id, is_deep_scan_done }) => {
        return (
          <div className={styles.operation}>
            <Button
              type="link"
              hidden={!is_deep_scan_done}
              onClick={() => {
                Modal.confirm({
                  title: '是否确认删除',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () =>
                    deleteScan({
                      scan_ids: [scan_id],
                    }).then(() => updateList()),
                });
              }}
            >
              删除
            </Button>
            <div hidden={is_deep_scan_done} className={styles.loading}></div>
            <div hidden={!is_deep_scan_done} className={styles.divide}></div>
            <Button
              type="link"
              hidden={!is_deep_scan_done}
              onClick={() =>
                history.push(`/asset/scan/detail/?scan_id=${scan_id}`)
              }
            >
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
        <div>
          <Button type="primary" onClick={() => setVisible(uid)}>
            新建扫描
          </Button>
          <> </>
          <Popover
            title="是否确认批量删除"
            overlayClassName={styles.myPopover}
            trigger="click"
            content={
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    runDelete({ scan_ids: selectKeys as string[] });
                    updateList();
                    setBatchDeleteVisible(false);
                  }}
                >
                  确定
                </Button>
              </Space>
            }
            visible={batchDeleteVisible}
            onVisibleChange={v => {
              if (!selectKeys.length) {
                message.error('请先选择扫描项');
                return;
              }
              setBatchDeleteVisible(v);
            }}
            placement="bottomLeft"
          >
            <Button type="primary" disabled={!selectKeys.length} ghost>
              删除
            </Button>
          </Popover>
        </div>

        <div>
          <Input.Search
            placeholder="请输入IP"
            defaultValue={query.search}
            accessKey="enter"
            allowClear
            onSearch={(value: string) => {
              setQuery({ search: value });
            }}
          />
        </div>
      </div>
      <Divider />

      <Table
        rowKey="scan_id"
        scroll={{ x: 1200 }}
        columns={columns}
        dataSource={data?.results || []}
        pagination={{
          pageSize: query.page_size,
          total: data?.count,
          onChange: (page, pageSize) => {
            setQuery({ page, page_size: pageSize });
          },
        }}
        rowSelection={{
          selectedRowKeys: selectKeys,
          getCheckboxProps: record => ({
            disabled: !record.is_deep_scan_done,
          }),
          onChange: (keys, _) => setSelectKeys(keys),
        }}
      />

      <AddScanModal
        visible={visible}
        setVisible={setVisible}
        updateList={updateList}
      />
    </div>
  );
}
