import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

type EChartsOption = echarts.EChartsOption;

const GaugeGraph = ({
  className,
  data,
  success,
  all,
  id,
}: {
  className?: string;
  data: number;
  success: string;
  all: string;
  id: string;
}) => {
  const myChart = useRef<echarts.EChartsType | null>(null);

  //init
  useEffect(() => {
    const option: EChartsOption = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
      },
      series: [
        {
          name: '扫描成功率',
          type: 'gauge',
          progress: {
            show: true,
          },
          detail: {
            valueAnimation: true,
            fontSize: 13,
            formatter: '{value}%',
            color: 'green',
          },
          data: [
            {
              value: data,
              name: success + '/' + all,
            },
          ],
        },
      ],
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
      series: [
        {
          data: [
            {
              value: data,
              name: success + '/' + all,
            },
          ],
        },
      ],
    });
  }, [data]);

  return <div className={className} style={{ height: 400 }} id={id}></div>;
};

export default GaugeGraph;
