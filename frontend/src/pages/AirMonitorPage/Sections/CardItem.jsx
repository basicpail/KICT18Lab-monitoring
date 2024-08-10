// RefrigerantCycleStatus.jsx
import React, { useState } from 'react';

const CardItem = ({data}) => {

    const deviceMap = {
        '73876dc8-569a-5de6-66f2-90fd1d89699a': '18동 룸1 공기질 센서0',
        'c90805f1-2f1f-1873-56bf-1205f252cc9d': '18동 룸1 공기질 센서1',
        '07f2922c-4962-108e-bef6-ba6b57e2048e': '18동 룸1 공기질 센서2',
        '5841eacc-00ec-0b2f-0548-8e7ed888712e': '18동 룸2 공기질 센서0',
        'b5f96156-10e0-c395-196e-15b90a26c226': '18동 룸2 공기질 센서1',
        'dc9ac978-8fd4-06f7-e6cd-c7b9f9b401a4': '18동 룸2 공기질 센서2'
      };
    
    const findDeviceName = (deviceId) => {
    return deviceMap[deviceId] || 'Device not found';
    };
  return (
    <div className="table-container">
    <h2 className="table-header">
        {findDeviceName(data.device_id)}
        <br>
        </br>
        {data.device_id}
    </h2>
      <table className="table">
        <thead>
          <tr>
            <th>항목</th>
            <th>값</th>
          </tr>
        </thead>
        <tbody>
        {/* <tr>
            <td>deviceID:</td>
            <td>{data.device_id}</td>
          </tr> */}
          <tr>
            <td>Temperature:</td>
            <td>{data.temperature}</td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>{data.humidity}</td>
          </tr>
          <tr>
            <td>PM10</td>
            <td>{data.pm10}</td>
          </tr>
          <tr>
            <td>PM2d5</td>
            <td>{data.pm2d5}</td>
          </tr>
          <tr>
            <td>PM1d0</td>
            <td>{data.pm1d0}</td>
          </tr>
          <tr>
            <td>Co2</td>
            <td>{data.co2}</td>
          </tr>
          <tr>
            <td>GAS</td>
            <td>{data.gas}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CardItem;
