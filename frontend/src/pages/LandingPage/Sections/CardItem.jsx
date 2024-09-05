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
import { useSelector, shallowEqual} from 'react-redux';
import axiosInstance from '../../../utils/axios';

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

const CardItem = ({ graphDataList}) => {
  //const chartRef = useRef(null);
  const chartData = useSelector(state => state.device?.dashBoardGraphData);
  
  const transformData = (data, category, entity) => {
    // data
    // .filter(entry => entry.y !== undefined && Object.keys(entry.y).length > 0)
    // .map(entry => {
    //   console.log('entry: ',entry)
    //   console.log('category, entity:' ,category, entity)
    //   console.log('entry.y:' ,entry.y)
    //   console.log('entry.y[category]:' ,entry.y[category])
    //   console.log('entry.y[category][entity]:' ,entry.y[category][entity])
    //   console.log('Object.keys(entry.y).length', Object.keys(entry.y).length)
    // })
    if (category === 'Room1' || category === 'Room2') {
      return data
        .filter(entry => entry.y !== undefined && Object.keys(entry.y).length > 0)
        .map(entry => {
          return {
              x: entry.x,
              y: entry.y[category][entity][graphDataList['secondEntity']]
          };
        }
      );      
    }
    else {
      return data
        .filter(entry => entry.y !== undefined && Object.keys(entry.y).length > 0)
        .map(entry => {
          return {
              x: entry.x,
              y: entry.y[category][entity]
          };
        }
      );
    }
  };

  // // 데이터 요청을 주기적으로 실행하는 useEffect
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get('/devices/getDeviceDataFromDB');
  //       setSharedData(prevData => [...prevData, response.data]);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   const interval = setInterval(fetchData, getInterval); // getInterval 마다 데이터 요청

  //   return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  // }, []);

  const createDataOld = (graphDataList) => ({
    datasets: graphDataList['entity'].map((entity, i) => ({
      //label: graphDataList['secondEntity'] === undefined ? `${entity}` : `${graphDataList['category']} ${entity}`,
      label: graphDataList['secondEntity'] === undefined ? `${entity}` : `${graphDataList['category']} ${entity} ${graphDataList['secondEntity']}`,
      backgroundColor: `rgba(${40 + i*80}, ${10 + i*10}, ${10 + i*10}, 0.6)`,
      borderColor: `rgba(${40 + i*80}, ${10 + i*10}, ${10 + i*10}, 0.6)`,
      borderWidth: 3,
      data: transformData([...chartData], graphDataList['category'], entity),
      yAxisID: `y-axis-${i+1}`
    }))
    
  //   datasets: [
  //     {
  //     label: `Realtime Data ${index + 1}`,
  //     backgroundColor: 'rgba(75,192,192,0.4)',
  //     borderColor: 'rgba(75,192,192,1)',
  //     borderWidth: 1,
  //     data: transformData([...chartData],'transmitter','급기온도'),
  //     yAxisID: 'y-axis-1'
  //   },
  //   {
  //     label: `Realtime Data ${index + 1}`,
  //     backgroundColor: 'rgba(75,192,192,0.4)',
  //     borderColor: 'rgba(105,102,102,1)',
  //     borderWidth: 1,
  //     data: transformData([...chartData],'transmitter','급기Co2'),
  //     yAxisID: 'y-axis-2'
  //   },
  // ]
  });

  const createData = (graphDataList) => {
    try {
      return {
        datasets: graphDataList['entity'].map((entity, i) => ({
          label: graphDataList['secondEntity'] === undefined ? `${entity}` : `${graphDataList['category']} ${entity} ${graphDataList['secondEntity']}`,
          backgroundColor: `rgba(${40 + i*80}, ${10 + i*10}, ${10 + i*10}, 0.6)`,
          borderColor: `rgba(${40 + i*80}, ${10 + i*10}, ${10 + i*10}, 0.6)`,
          borderWidth: 3,
          data: transformData([...chartData], graphDataList['category'], entity),
          yAxisID: `y-axis-${i+1}`
        }))
      };
    } catch (error) {
      console.error('Error creating data:', error);
      return {
        datasets: []
      };
    }
  };
  

  const createOptions = () => {
    let options ={}
    if (graphDataList['category'] === 'Room1' || graphDataList['category'] === 'Room2') {
      options = {
        responsive: true,
        animation: false,
        //spanGaps: 2000*60, //1000*60 1분
        //maxDataPoints: 100,
        scales: {
          x: {
            type: 'realtime',
            realtime: {
              duration: 50000,
              refresh: 5000,
              delay: 1000,
              onRefresh: function(chart) {
                // 차트 데이터가 자동으로 업데이트 되도록 설정 (sharedData가 갱신될 때)
              }
            }
          },
          'y-axis-1': {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: `${graphDataList['category']} ${graphDataList['entity'][0]} ${graphDataList['secondEntity']}`,
            },
            grid: {
              display: true,
              drawOnChartArea: true
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: `${graphDataList['category']} ${graphDataList['entity'][1]} ${graphDataList['secondEntity']}`,
            },
            grid: {
              display: true,
              drawOnChartArea: true
            }
          },
        },
        plugins: {
          streaming: {
            frameRate: 30 // refresh rate
          }
        }
      };
    }
    else {
      options = {
        responsive: true,
        animation: false,
        //maxDataPoints: 100,
        scales: {
          x: {
            type: 'realtime',
            realtime: {
              duration: 20000,
              refresh: 2000,
              delay: 1000,
              onRefresh: function(chart) {
                // 차트 데이터가 자동으로 업데이트 되도록 설정 (sharedData가 갱신될 때)
              }
            }
          },
          'y-axis-1': {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: `${graphDataList['entity'][0]}`,
            },
            grid: {
              display: true,
              drawOnChartArea: true
            }
          },
          'y-axis-2': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: `${graphDataList['entity'][1]}`,
            },
            grid: {
              display: true,
              drawOnChartArea: true
            }
          },
          'y-axis-3': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: `${graphDataList['entity'][2]}`,
            },
            grid: {
              display: true,
              drawOnChartArea: true
            }
          },
        },
        plugins: {
          streaming: {
            frameRate: 30 // refresh rate
          }
        }
      };
    }

    return options
  }
  
  

  return (
    <div>
      <Line
        data={createData(graphDataList)}
        options={createOptions()}
      />
    </div>
  );
};



export default CardItem;
