import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

interface DataItem {
  name: string;
  value: [number, number];
}

type EChartsOption = echarts.EChartsOption;

const DynamicLineGraph = ({
  className,
  data,
  id,
}: {
  className?: string;
  data: DataItem[];
  id: string;
}) => {
  //   let option: EChartsOption;
  let timer: any = null;
  const myChart = useRef<echarts.EChartsType | null>(null);
  //   function pushData(value: number): DataItem {
  //     now += 120000;
  //     const time = new Date(now);
  //     return {
  //       name: `${time.getHours()}时${time.getMinutes()}分,内存占用${Math.round(
  //         value,
  //       )}% `,
  //       value: [now, Math.round(value)],
  //     };
  //   }

  //   let data: DataItem[] = [];
  //   let now = new Date().valueOf();
  //   console.log(data);

  useEffect(() => {
    const option: EChartsOption = {
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
      grid: {
        top: 10,
        bottom: 10,
        right: 40,
        left: 40,
      },
    };
    const chartDom = document.getElementById(id)!;
    myChart.current = echarts.init(chartDom);
    window.addEventListener('resize', () => myChart.current?.resize());
    // timer = setInterval(() => {
    //   getPercent({ hash_id: 'db5a080e86afec19b5d0566d39ac185c' }).then(res => {
    //     if (data.length > 10) data.shift();
    //     data.push(pushData(res.cpu_used));
    //     myChart.setOption<echarts.EChartsOption>({
    //       series: [
    //         {
    //           data: data,
    //         },
    //       ],
    //     });
    //   });
    // }, 5000);
    // option && myChart.setOption(option);
    option && myChart.current.setOption(option);

    return () => {
      //   clearInterval(timer);
      //   timer = null;
      myChart.current?.dispose();
    };
  }, []);

  useEffect(() => {
    myChart.current?.setOption<echarts.EChartsOption>({
      series: [
        {
          data: data,
        },
      ],
    });
  }, [data]);

  return <div className={className} style={{ height: 400 }} id={id}></div>;
};

export default DynamicLineGraph;
