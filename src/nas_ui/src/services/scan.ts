import request from '@/utils/request';
import * as Scan from '@/types/scan';

const getFirstScanResultApi = '/v1/scan/getfirst';
const getFirstScanIpResultApi = '/v1/scan/ip';

export const getFirstScanResult = (params: { scan_id: string }) =>
  request<Scan.FirstScanResult>(getFirstScanResultApi, {
    method: 'GET',
    params,
  });

export const getFirstScanIpResult = (params: { scan_id: string; ip: string }) =>
  request<Scan.FirstScanIpResult>(getFirstScanIpResultApi, {
    method: 'GET',
    params,
  });
