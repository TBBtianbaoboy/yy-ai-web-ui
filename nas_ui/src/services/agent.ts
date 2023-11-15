import request from '@/utils/request';
import * as Asset from '@/types/asset';
import * as Scan from '@/types/scan';
import { ListRes, ListReq, StatusOk } from '@/types/common';

// 获取agent列表
const getAgentList = '/v1/agent/';
const getScantList = '/v1/scan';
const deleteAgentApi = '/v1/agent/';
// 获取agent主机系统信息
const getSysInfo = '/v1/agent/info/system/';
// 获取agent主机对外开放端口信息
const getPorts = '/v1/agent/info/port/';
const getBaselineInfo = '/v1/agent/baseline';
const getBaselineDetail = '/v1/agent/baseline/info';
const getSecgrpList = '/v1/agent/secgrp';
// const getBaselineDetail = '/v1/agent/baseline/info'

//ok
export const getAgent = (params: ListReq<{}>) =>
  request<ListRes<Asset.AssetItem[]>>(getAgentList, {
    method: 'GET',
    params,
  });

export const deleteAgent = (params: { hash_ids: string[] }) =>
  request<ListRes<Asset.AssetScan[]>>(deleteAgentApi, {
    method: 'DELETE',
    body: params,
  });

//ok
export const getScan = (params: ListReq<{}>) =>
  request<ListRes<Asset.AssetScan[]>>(getScantList, {
    method: 'GET',
    params,
  });

export const deleteScan = (params: { scan_ids: string[] }) =>
  request<ListRes<Asset.AssetScan[]>>(getScantList, {
    method: 'DELETE',
    body: params,
  });

export const addScan = (params: Scan.ScanAdd) =>
  request<StatusOk>(getScantList, {
    method: 'POST',
    body: params,
  });

//ok
export const getPercent = (params: { hash_id: string }) =>
  request<Asset.PercentMap>(getSysInfo, {
    method: 'GET',
    params,
  });

//ok
export const getPort = (params: {
  hash_id: string;
  port_status: string;
  port_type: string;
}) =>
  request<ListRes<Asset.PortItem[]>>(getPorts, {
    method: 'GET',
    params,
  });

export const getBaseline = (params: { hash_id: string }) =>
  request<Asset.BaselineItem>(getBaselineInfo, {
    method: 'GET',
    params,
  });

export const changeBaselineInfo = (params: {
  cis_id: string;
  agent_id: string;
}) =>
  request<{ status: boolean }>(getBaselineInfo, {
    method: 'PUT',
    body: params,
  });

//ok
export const reBaselineInfo = (params: { agent_id: string }, update: any) =>
  request<{ status: boolean }>(getBaselineInfo, {
    method: 'POST',
    body: params,
  }).finally();

export const getBaselineDetailinfo = (params: { cis_id: string }) =>
  request<Asset.BaselineDetail>(getBaselineDetail, {
    method: 'GET',
    params,
  });

export const getSecgrp = (
  params: ListReq<{ direction: number; agent_id: string }>,
) =>
  request<ListRes<Asset.SecgrpItem[]>>(getSecgrpList, {
    method: 'GET',
    params,
  });
//ok
export const deleteSecgrp = (params: { rule_id: string; agent_id: string }) =>
  request<ListRes<Asset.SecgrpItem[]>>(getSecgrpList, {
    method: 'DELETE',
    body: params,
  });

export const addSecgrp = (params: Asset.SecgrpAdd) =>
  request<ListRes<Asset.SecgrpItem[]>>(getSecgrpList, {
    method: 'POST',
    body: params,
  });
