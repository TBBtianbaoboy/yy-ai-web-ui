import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

type EChartsOption = echarts.EChartsOption;

const PathGraph = ({
  className,
  title,
  data,
  result,
  id,
}: {
  className?: string;
  title: string;
  data: string[];
  result: number[];
  id: string;
}) => {
  const myChart = useRef<echarts.EChartsType | null>(null);

  // const result1 = data.map(function(item, i) {
  //     return Math.round(Math.random() * 1000 * (i + 1));
  // });
  const links = result.map(function(item, i) {
    return {
      source: i,
      target: i + 1,
    };
  });
  links.pop();

  //init
  useEffect(() => {
    const option: EChartsOption = {
      title: {
        text: title,
      },
      tooltip: {
        trigger: 'item',
        formatter: 'IP : {b} <br/> TTL : {c}',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        show: false,
        data: data,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          type: 'graph',
          layout: 'circular',
          coordinateSystem: 'cartesian2d',
          symbolSize: 50,
          label: {
            show: true,
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          data: result,
          links: links,
          lineStyle: {
            color: '#eb34b1',
          },
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
          data: result,
        },
      ],
    });
  }, [result]);

  return <div className={className} style={{ height: 400 }} id={id}></div>;
};

export default PathGraph;
