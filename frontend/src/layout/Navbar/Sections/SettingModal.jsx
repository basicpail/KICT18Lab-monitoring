import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axiosInstance from '../../../utils/axios';
import { toast } from "react-toastify";

Modal.setAppElement('#root');

const SettingModal = ({ closeModal }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDataList, setSelectedDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  // 추가된 상태 변수
  const [selectedDropdown, setSelectedDropdown] = useState('');
  const [updateInterval, setUpdateInterval] = useState('');
  const [insertInterval, setInsertInterval] = useState('');

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

  const handleDropdownChange = (e) => {
    setSelectedDropdown(e.target.value);
  };

  const handleUpdateIntervalChange = (e) => {
    setUpdateInterval(e.target.value);
  };

  const handleInsertIntervalChange = (e) => {
    setInsertInterval(e.target.value);
  }

  const handleDropdownSubmit = () => {
    console.log("Selected Dropdown Value: ", selectedDropdown);
  };

  const handleTextInputSubmit = () => {
    console.log("Text Input Value: ", updateInterval);
  };

  const dataList = ['Data1', 'Data2', 'Data3'];
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
          <h2 className="text-3xl">Settings</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form className="space-y-6">
          <div className="flex items-center">
            <label className="block text-lg font-medium text-gray-700 mr-2">
              PORT:
            </label>
            <select
              value={selectedDropdown}
              onChange={handleDropdownChange}
              className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            >
              <option value="">Select a Port</option>
              <option value="option1">COM 1</option>
              <option value="option2">COM 2</option>
              <option value="option3">COM 3</option>
              <option value="option3">COM 4</option>
              <option value="option3">COM 5</option>
            </select>
            <button
              type="button"
              onClick={handleDropdownSubmit}
              className="ml-2 bg-blue-500 text-white rounded-md px-4 py-1"
            >
              설정
            </button>
          </div>
          <div className="flex items-center">
            <label className="block text-lg font-medium text-gray-700 mr-2">
              업데이트 주기:
            </label>
            <input
              type="text"
              value={updateInterval}
              onChange={handleUpdateIntervalChange}
              className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              placeholder="텍스트 입력"
            />
            <button
              type="button"
              onClick={handleTextInputSubmit}
              className="ml-2 bg-blue-500 text-white rounded-md px-4 py-1"
            >
              설정
            </button>
          </div>
          <div className="flex items-center">
            <label className="block text-lg font-medium text-gray-700 mr-2">
              저장 주기:
            </label>
            <input
              type="text"
              value={insertInterval}
              onChange={handleInsertIntervalChange}
              className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
              placeholder="텍스트 입력"
            />
            <button
              type="button"
              onClick={handleTextInputSubmit}
              className="ml-2 bg-blue-500 text-white rounded-md px-4 py-1"
            >
              설정
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SettingModal;
