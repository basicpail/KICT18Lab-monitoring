import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axiosInstance from '../../../utils/axios';
import { toast } from "react-toastify";
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { dataList } from '../../../utils/const';

Modal.setAppElement('#root');

const ReportModal = ({ closeModal }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDataList, setSelectedDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false); // 추가: 모두 선택 상태

  useEffect(() => {
    openModal();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const handleFetchData = async () => {
    try {
      const response = await axiosInstance.post('/devices/getCSVDataFromDB', {
        startDate,
        endDate,
        selectedDataList,
      });

      // Create CSV from JSON data using papaparse
      const csv = '\ufeff' + Papa.unparse(response.data);//'\ufeff' 한글 깨짐 문제로 추가
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const now = new Date();
      const timestamp = now.toISOString().replace(/:/g, '-').slice(0, 19);
      saveAs(blob, `${timestamp}.csv`);

      setSelectedDataList([]);
      toast.info('저장 완료');
      closeModal();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('저장 실패');
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

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedDataList(dataList);
    } else {
      setSelectedDataList([]);
    }
    setSelectAll(!selectAll);
  };

  // const dataList = ['급기풍량', '급기온도', '급기Co2', '배기풍량', '배기온도', '배기Co2', '누적전력량', '전압', '전류', '전력', 'Room1 SMD 디퓨저 목표 개도 값', 'Room1 SMD 설정 풍량', 'Room1 SMD 풍량제어 제어시간 간격', 'Room1 SMD 풍량제어 목표도달 판단기준값', 'Room1 SMD 풍량제어 디퓨저 개도 위치 조정값', 'Room1 SMD 설정온도', 'Room1 SMD 온도제어 제어시간 간격', 'Room1 SMD 현재 개도 값', 'Room1 SMD 현재풍량', 'Room1 SMD 실내온도', 'Room1 SMD 공급 대기 온도', 'Room1 SMD Co2농도', 'Room1 SMU 디퓨저 목표 개도 값', 'Room1 SMU 설정 풍량', 'Room1 SMU 풍량제어 제어시간 간격', 'Room1 SMU 풍량제어 목표도달 판단기준값', 'Room1 SMU 풍량제어 디퓨저 개도 위치 조정값', 'Room1 SMU 설정온도', 'Room1 SMU 온도제어 제어시간 간격', 'Room1 SMU 현재 개도 값', 'Room1 SMU 현재풍량', 'Room1 SMU 실내온도', 'Room1 SMU 공급 대기 온도', 'Room1 SMU Co2농도', 'Room2 SMD 디퓨저 목표 개도 값', 'Room2 SMD 설정 풍량', 'Room2 SMD 풍량제어 제어시간 간격', 'Room2 SMD 풍량제어 목표도달 판단기준값', 'Room2 SMD 풍량제어 디퓨저 개도 위치 조정값', 'Room2 SMD 설정온도', 'Room2 SMD 온도제어 제어시간 간격', 'Room2 SMD 현재 개도 값', 'Room2 SMD 현재풍량', 'Room2 SMD 실내온도', 'Room2 SMD 공급 대기 온도', 'Room2 SMD Co2농도', 'Room2 SMU 디퓨저 목표 개도 값', 'Room2 SMU 설정 풍량', 'Room2 SMU 풍량제어 제어시간 간격', 'Room2 SMU 풍량제어 목표도달 판단기준값', 'Room2 SMU 풍량제어 디퓨저 개도 위치 조정값', 'Room2 SMU 설정온도', 'Room2 SMU 온도제어 제어시간 간격', 'Room2 SMU 현재 개도 값', 'Room2 SMU 현재풍량', 'Room2 SMU 실내온도', 'Room2 SMU 공급 대기 온도', 'Room2 SMU Co2농도'];
  const filteredDataList = dataList.filter(data => data.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Select Data"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl">추출 데이터 선택</h2>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              placeholder="검색어 입력"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              데이터 선택:
              <button
                type="button"
                onClick={handleSelectAll}
                className="ml-5 mb-2 bg-gray-500 text-white rounded-md px-4 py-1"
              >
                {selectAll ? '모두 해제' : '모두 선택'}
              </button>
            </label>
            <div className="h-40 overflow-y-scroll border border-gray-300 rounded-md p-2">
              
              {filteredDataList.map((data, index) => (
                <div key={index}>
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
          </div>
          <button 
            type="button" 
            onClick={handleFetchData}
            className="w-full px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-700"
          >
            저장하기
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ReportModal;
