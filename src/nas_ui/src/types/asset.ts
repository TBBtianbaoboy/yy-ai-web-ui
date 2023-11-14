export interface AssetItem {
  agent_ip: string;
  hash_id: string;
  hostname: string;
  join_time: number;
  pid: number;
  status: boolean;
  update_time: number;
}

export interface AssetScan {
  deep_scan_done_time: number;
  first_scan_done_time: number;
  is_deep_scan_done: boolean;
  is_first_scan_done: boolean;
  scan_ip: string;
  scan_type: string;
  start_time: number;
  status: number;
  scan_id: string;
}

export interface PercentMap {
  cpu_core: number;
  cpu_used: number;
  disk_info: {
    device: string;
    fstype: string;
    mount_point: string;
    options: string;
    total: string;
    used_percent: number;
  };
  memory_total: string;
  memory_used: number;
}

export interface PortItem {
  pid: number;
  port: number;
  port_process_info: {
    cmdline: string;
    cpu_percent: number;
    create_time: number;
    cwd: string;
    memory_percent: number;
    pid_num: number;
    username: string;
  };
  port_service: string;
  port_status: string;
  port_type: string;
}

export interface BaselineItem {
  count: number;
  display_count: number;
  end_time: number;
  failed_count: number;
  results: BaselineResults[];
  start_time: number;
  success_count: number;
}

export interface BaselineResults {
  desc: string;
  id: string;
  is_ignored: boolean;
  status: boolean;
}

export interface BaselineDetail {
  desc: string;
  explain: string;
  name: string;
  solute: string;
}

export interface SecgrpItem {
  apply_policy: string;
  cidr: string;
  create_time: number;
  direction: string;
  port: number;
  protocol_type: string;
  rule_id: string;
}

export interface SecgrpAdd {
  agent_id: string;
  apply_policy: number;
  cidr: string;
  direction: number;
  port: number;
  protocol_type: number;
}
