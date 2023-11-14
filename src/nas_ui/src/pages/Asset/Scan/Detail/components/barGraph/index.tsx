import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

type EChartsOption = echarts.EChartsOption;

const BarGraph = ({
  className,
  xname,
  xdata,
  ydata,
  id,
}: {
  className?: string;
  xname: string;
  xdata: string[];
  ydata: number[];
  id: string;
}) => {
  const myChart = useRef<echarts.EChartsType | null>(null);

  //init
  useEffect(() => {
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      toolbox: {
        feature: {
          magicType: { show: true, type: ['line', 'bar'] },
          saveAsImage: { show: true },
        },
      },
      xAxis: {
        type: 'category',
        data: xdata,
        name: xname,
      },
      yAxis: [
        {
          type: 'value',
          name: '数量',
          interval: 10,
        },
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          barWidth: '60%',
          data: ydata,
        },
      ],
      grid: {
        bottom: '10%',
        top: '10%',
        containLabel: true,
      },
    };
    const chartDom = document.getElementById(id)!;
    myChart.current = echarts.init(chartDom);
    option && myChart.current.setOption(option);

    return () => {
      myChart.current?.dispose();
    };
  }, []);

  //refresh
  useEffect(() => {
    myChart.current?.setOption<echarts.EChartsOption>({
      xAxis: {
        data: xdata,
      },
      series: [
        {
          data: ydata,
        },
      ],
    });
  }, [ydata]);

  return <div className={className} style={{ height: 400 }} id={id}></div>;
};

export default BarGraph;
