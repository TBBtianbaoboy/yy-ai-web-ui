export interface ScanAdd {
  is_with_default_script: boolean;
  is_with_os_detection: boolean;
  is_with_service_info: boolean;
  is_with_trace_route: boolean;
  scan_ip: string;
  scan_type: number;
  scan_type_message: string;
}

export interface FirstScanResult {
  count: string;
  all: string;
  rate: number;
  elapsed: number;
  ip_domain: string;
  start_time: number;
  end_time: number;
  portfb: Map<number, number>;
  servicefb: Map<string, number>;
  results: DeepScanResult[];
  scan_type: number;
  scan_type_message: string;
  with_os: boolean;
  with_script: boolean;
  with_service: boolean;
  with_trace: boolean;
}

export interface DeepScanResult {
  ip: string;
  ip_type: string;
  status: string;
  status_reason: string;
}

export interface FirstScanIpResult {
  port_service_sum: number;
  port_service_info: FirstScanIpResultDoc[];
  os_guest_sum: number;
  os_guest: OsGuest[];
  trace: string[];
  trace_ttl: number[];
  trace_port: string;
  trace_protocol: string;
}

export interface FirstScanIpResultDoc {
  port_id: number;
  protocol: string;
  service_name: string;
  service_extra_info: ServiceExtraInfo;
  script: ScriptInfo[];
  service_state: string;
  service_ttl: number;
}

export interface ScriptInfo {
  id: string;
  output: string;
  elements: ElementInfo[];
}

export interface ElementInfo {
  key: string;
  value: string;
}

export interface ServiceExtraInfo {
  version: string;
  product: string;
  method: string;
  extra_info: string;
  tunnel: string;
  cpes: string[];
}

export interface OsGuest {
  name: string;
  value: number;
}
