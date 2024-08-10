import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { RealTimeScale, StreamingPlugin } from 'chartjs-plugin-streaming';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import { useSelector } from 'react-redux';

Chart.register(
  StreamingPlugin,
  RealTimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CardItem() {

  const chartDataRedux = useSelector(state => state.device?.graphData);
  const chartDataReduxRef = useRef(chartDataRedux);

  // if (chartDataReduxRef.current !== chartDataRedux) {
  //   chartDataReduxRef.current = chartDataRedux;
  // }
  // const memorizedValue = useMemo(() => {
  //   return chartDataRedux
  // },[chartDataRedux])
  // console.log('memorizedValue: ', memorizedValue)
  //const chartDataRedux = useSelector(state => state.device?.deviceAllData);
  const lastArrayelement = chartDataRedux[chartDataRedux.length -1];
  //console.log("chartDataRedux: ", chartDataRedux);
  //console.log("chartDataRedux: ", chartDataRedux[chartDataRedux.length -1]);
  //const [chartData, setChartData] = useState([]);
  //setChartData([...chartData, chartDataRedux[chartDataRedux.length -1]]);


  return (
    <Line
      //style={{height:'100%', width:'100%'}}
      data={{
        datasets: [
          {
          label: 'Dataset 1',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderDash: [8, 4],
          fill: true,
          data: [],
          },
          {
          label: 'Dataset 2',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          cubicInterpolationMode: 'monotone',
          fill: true,
          data: [],
          },
        ],
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: 'deviceName'
          }
        },
        //maintainAspectRatio: false,
        responsive: true,
        spanGaps: 2000 * 60, //2분
        scales: {
          x: {
            type: 'realtime',
            realtime: {
                duration: 50000,
                delay: 1000,
                onRefresh: (chart) => {
                  chart.data.datasets.forEach((dataset) => {
                      dataset.data.push({
                        x: Date.now(),
                        y: Math.random(),
                      });
                      //dataset.data.push(chartDataRedux[chartDataRedux.length -1])
                      console.log("onRefresh_dataset.data: ", dataset.data);
                  });
                },
                grid: {
                  lineWidth: 1,
                  borderDash: [4, 4],
                  borderWidth: 10
                },
                ticks: {
                  displayFormats: 1,
                  maxRotation: 0,
                  minRotation: 0,
                  stepSize: 1,
                  maxTicksLimit: 50000,
                  minUnit: "second",
                  source: "auto",
                  autoskip: true
                }
            },
          },
          y: {
            grid: {
              lineWidth: 1,
              borderDash: [4, 4]
            },
            ticks: {
              beginAtZero: true,
              max: 1
            }
          }
        },
      }}
    />
  );
}

export default CardItem;