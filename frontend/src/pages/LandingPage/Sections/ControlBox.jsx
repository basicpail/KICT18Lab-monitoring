import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import axiosInstance from '../../../utils/axios';

const ControlBox = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputValuePlaceholder, setInputValuePlaceholder] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  const dispatch = useDispatch();

  const handleValueChange = (event) => {
    const {id, value} = event.target;
    //setTextareaValue(`${id} ${value}`);
    if (id === 'select-room') setSelectedRoom(value);
    if (id === 'select-device') setSelectedDevice(value);
    if (id === 'select-function') {
      setSelectedFunction(value);
      handlePlaceholder(value);
    }
    if (id === 'function-input-value') setInputValue(value);
    //setSelectedRoom(event.target.value);
  };

  const handleTextareaChange = (event) => {
    // setTextareaValue((prevText)=>{
    //   prevText+'\n'+event.target.value
    // })
    console.log(textareaValue)
    console.log(event.target.value)
    setTextareaValue(textareaValue+'\n'+event.target.value);
  };

  const handleOnClick = (event) => {
    event.preventDefault();
    const now = new Date
    setTextareaValue(prev => `${now.toLocaleString()}  ${selectedRoom.toUpperCase()} ${selectedDevice.toUpperCase()} Address: ${selectedFunction} Input: ${inputValue} Request! \n` + prev);

    //const now = new Date
    // setTextareaValue((prevData) => {
    //   prevData+`${now.toLocaleString()}  ${selectedRoom} ${selectedDevice} ${selectedFunction} ${inputValue} \n`
    // })
    //setTextareaValue(`${now.toLocaleString()}  ${selectedRoom.toUpperCase()} ${selectedDevice.toUpperCase()} Address: ${selectedFunction} Input: ${inputValue} Request! \n` + textareaValue);

    sendControlRequest({selectedRoom, selectedDevice, selectedFunction, inputValue})
  };

  const handlePlaceholder = (value) => {
    let placeholder = '';
    if (value === '0') placeholder='0~3 (3:수동모드)'
    if (value === '7') placeholder='SMD 최대2500 SMU 최대14000'
    if (value === '10') placeholder='50~1000 (기본400)'
    if (value === '13') placeholder='10~600 (기본10)'
    if (value === '14') placeholder='10~100 (기본20)'
    if (value === '15') placeholder='100~400 (기본300)'
    if (value === '20') placeholder='15~30 (기본25)'
    if (value === '21') placeholder='10~600 (기본10)'
    setInputValuePlaceholder(placeholder)
  }

  const sendControlRequest = async ({selectedRoom, selectedDevice, selectedFunction, inputValue}) => {
    const body = {
      selectedRoom,
      selectedDevice,
      selectedFunction,
      inputValue
    }
    try {

      const response = await axiosInstance.post('/devices/control', body)
      const now = new Date
      setTextareaValue(prev => `${now.toLocaleString()} ${response.data}`+'\n'+prev);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 mb-2">
      <select
        id="select-room"
        value={selectedRoom}
        onChange={handleValueChange}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>Select Room</option>
        <option value="room1">Room 1</option>
        <option value="room2">Room 2</option>
      </select>

      <select
        id="select-device"
        value={selectedDevice}
        onChange={handleValueChange}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>Select Device</option>
        <option value="smd">SMD(급기)</option>
        <option value="smu">SMU(배기)</option>
      </select>

      <select
        id="select-function"
        value={selectedFunction}
        onChange={handleValueChange}
        className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>Select Function</option>
        <option value="0">디퓨저 모드</option>
        <option value="7">디퓨저 목표 개도 값</option>
        <option value="10">설정 풍량</option>
        <option value="13">풍량제어 시간 간격</option>
        <option value="14">목표도달 판단기준값</option>
        <option value="15">개도 위치 조정값(diff)</option>
        <option value="20">설정 온도</option>
        <option value="21">온도제어 시간 간격</option>
      </select>

      <input 
        id='function-input-value'
        type='text'
        className='w-full border border-black text-black placeholder:text-xs rounded-md'
        value={inputValue}
        onChange={handleValueChange}
        placeholder={inputValuePlaceholder}
      />

      <button
        className='w-full text-white bg-black rounded-md hover:bg-gray-500'
        onClick={handleOnClick}
      >
        실행
      </button>

      <fieldset className="col-span-1 sm:col-span-5 border border-gray-300 rounded-md p-2 w-full">
        <legend className="text-sm text-gray-500">Log</legend>
        <textarea
          id="textarea"
          className="w-full bg-white border-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 overflow-y-auto"
          rows="1"
          value={textareaValue}
          readOnly
        ></textarea>
      </fieldset>
    </div>
  );
};

export default ControlBox;
