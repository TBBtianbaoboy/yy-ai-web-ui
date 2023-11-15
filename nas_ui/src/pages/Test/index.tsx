import { getPercent } from '@/services/agent';
import * as echarts from 'echarts';
import React, { useEffect } from 'react';

export default () => {
  type EChartsOption = echarts.EChartsOption;
  let option: EChartsOption;
  let timer: any = null;
  interface DataItem {
    name: string;
    value: [number, number];
  }

  function pushData(value: number): DataItem {
    now += 120000;
    const time = new Date(now);
    return {
      name: `${time.getHours()}时${time.getMinutes()}分,内存占用${Math.round(
        value,
      )}% `,
      value: [now, Math.round(value)],
    };
  }

  let data: DataItem[] = [];
  let now = new Date().valueOf();

  option = {
    title: {
      text: 'Dynamic Data & Time Axis',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        return params[0].data.name;
      },
      axisPointer: {
        animation: false,
      },
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
      show: false,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: 'CpuData',
        type: 'line',
        showSymbol: false,
        data: data,
      },
    ],
  };

  useEffect(() => {
    const chartDom = document.getElementById('testEcharts')!;
    const myChart = echarts.init(chartDom);

    timer = setInterval(() => {
      getPercent({ hash_id: 'db5a080e86afec19b5d0566d39ac185c' }).then(res => {
        if (data.length > 10) data.shift();
        data.push(pushData(res.cpu_used));
        myChart.setOption<echarts.EChartsOption>({
          series: [
            {
              data: data,
            },
          ],
        });
      });
    }, 5000);
    option && myChart.setOption(option);

    return () => {
      clearInterval(timer);
      timer = null;
    };
  }, []);

  return <div style={{ height: 400 }} id="testEcharts"></div>;
};
