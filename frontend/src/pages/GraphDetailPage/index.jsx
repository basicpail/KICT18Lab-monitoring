import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import downsample from 'chartjs-plugin-downsample';
import axios from 'axios';
import axiosInstance from '../../utils/axios';
import { toast } from "react-toastify";
import { dataList } from '../../utils/const';

//Chart.register(DownSamplePlugin);
Modal.setAppElement('#root');

const GraphDetailPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDataList, setSelectedDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartDataList, setChartDataList] = useState(() => {
    const savedCharts = localStorage.getItem('chartDataList');
    return savedCharts ? JSON.parse(savedCharts) : [];
  });
  const [chartOptions, setChartOptions] = useState([]);

  useEffect(() => {
    localStorage.setItem('chartDataList', JSON.stringify(chartDataList));
  }, [chartDataList]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  function generateData(count, startDate, endDate, types) {
    const data = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const typesCount = types.length;
  
    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  
    for (let i = 0; i < count; i++) {
      const randomDay = Math.floor(Math.random() * totalDays);
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + randomDay);
  
      const value = Math.floor(Math.random() * 100);
      const randomTypeIndex = Math.floor(Math.random() * typesCount);
      const type = types[randomTypeIndex];
  
      data.push({
        date: currentDate.toISOString().split('T')[0],
        value,
        type,
      });
    }
  
    return data;
  }

  const handleFetchData = async () => {
    try {
      // const startDate = '2023-01-01';
      // const endDate = '2023-10-30';
      // const types = ['data1', 'data2', 'data3'];
      // const data = generateData(50, startDate, endDate, types);
      console.log('startDate: ', startDate);
      console.log('endDate: ', endDate);
      console.log('selectedDataList: ', selectedDataList);
      
      const response = await axiosInstance.post('/devices/getDeviceDataFromDB', {
        startDate,
        endDate,
        selectedDataList,
      });
      const data = response.data;

      // const data = [
      //   { "date": "2023-01-01", "value": 10, "type": "data1" },
      //   { "date": "2023-01-02", "value": 15, "type": "data1" },
      //   { "date": "2023-01-03", "value": 8, "type": "data1" },
      //   { "date": "2023-01-04", "value": 12, "type": "data1" },
      //   { "date": "2023-01-05", "value": 14, "type": "data1" },
      //   { "date": "2023-01-01", "value": 5, "type": "data2" },
      //   { "date": "2023-01-02", "value": 7, "type": "data2" },
      //   { "date": "2023-01-03", "value": 6, "type": "data2" },
      //   { "date": "2023-01-04", "value": 9, "type": "data2" },
      //   { "date": "2023-01-05", "value": 11, "type": "data2" },
      //   { "date": "2023-01-01", "value": 20, "type": "data3" },
      //   { "date": "2023-01-02", "value": 18, "type": "data3" },
      //   { "date": "2023-01-03", "value": 22, "type": "data3" },
      //   { "date": "2023-01-04", "value": 19, "type": "data3" },
      //   { "date": "2023-01-05", "value": 23, "type": "data3" }
      // ]
      
      if (!data || !data.length) {
        throw new Error("No data returned");
      }

      const labels = Array.from(new Set(data.map(item => item.date)));
      // const labels = selectedDataList.map(selectedData => {
      //   return data.filter(item => item.type === selectedData).map(item => item.date)
      // })
      const datasets = selectedDataList.map(selectedData => {
        const dataValues = data.filter(item => item.type === selectedData).map(item => item.value);
        return {
          label: selectedData,
          data: dataValues,
          borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
          backgroundColor: 'rgba(0,0,0,0)',
          fill: false,
        };
      });

      const option = {
        plugins: {
          downsample: {
            enabled: true,
            threshold: 10,
          }
        }
      };
      const options = data.map(_ => option);
      setChartOptions(options);

      const newChartData = {
        labels,
        datasets,
        //options
      };

      setChartDataList(prevList => [...prevList, newChartData]);
      setSelectedDataList([]);
      toast.info('그래프 추가 완료')
      closeModal();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('그래프 생성 실패')
    }
  };

  const handleDataListChange = (e) => {
    const { value, checked } = e.target;
    setSelectedDataList((prevSelected) => {
      if (checked && prevSelected.length < 6) {
        return [...prevSelected, value];
      } else if (!checked) {
        return prevSelected.filter(item => item !== value);
      } else {
        return prevSelected;
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteChart = (index) => {
    setChartDataList(prevList => prevList.filter((_, i) => i !== index));
  };

  const filteredDataList = dataList.filter(data => data.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-4">
        <button 
          onClick={openModal}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-700"
        >
          그래프 추가하기
        </button>
      </div>

    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Select Data"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl">그래프 데이터 선택</h2>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Start Date:
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              데이터 검색:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            />
          </div>
          <div className="mt-1 h-48 overflow-y-auto border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg">
            {filteredDataList.map(data => (
              <div key={data} className="px-4 py-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={data}
                    onChange={handleDataListChange}
                    checked={selectedDataList.includes(data)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{data}</span>
                </label>
              </div>
            ))}
          </div>
          {selectedDataList.length >= 6 && (
            <p className="text-red-500 text-sm mt-2">최대 6개 까지 선택 가능합니다.</p>
          )}
          <button 
            type="button" 
            onClick={handleFetchData}
            className="w-full px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-700"
          >
            추가하기
          </button>
        </form>
      </div>
    </Modal>


    <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
      {chartDataList.map((chartData, index) => (
        <div key={index} className="relative">
          <Line data={chartData}/>
          <button
            onClick={() => handleDeleteChart(index)}
            className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 bg-red-500 text-white rounded shadow hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      ))}
      </div>
    </div>
  );
};

export default GraphDetailPage;
