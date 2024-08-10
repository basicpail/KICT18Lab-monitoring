// modbusUtils.js
const { convertArrayForTransmitter, convertArrayForPowermetter, convertToControlParams } = require('./formatting')
const { transmitterRegisterArray, smdRegisterArray,smuRegisterArray,smdsmuRegisterDescriptions, powermeterRegisterArray } = require('./const');

const ModbusRTU = require('modbus-serial');

// Modbus RTU 클라이언트 생성
const client = new ModbusRTU();


// 시리얼 포트 및 옵션 설정
const portName = 'COM4'; // 시리얼 포트 이름에 따라 변경
const options = {
  baudRate: 9600, // 통신 속도 (bps)
  parity: 'none', // 패리티 (none, even, odd)
  stopBits: 1, // 스톱 비트 (1, 2)
  dataBits: 8, // 데이터 비트 (5, 6, 7, 8)
  bufferSize: 256 // 버퍼 크기
};

// 연결 함수
function connectModbus() {
  try {
    client.connectRTUBuffered(portName, options);
    console.log('Modbus RTU connected');
  } catch (err) {
    console.error('Modbus RTU connection error:', err);
  }
}


//client.readHoldingRegisters(slaveId, startAddress, length); //slaveId 확인!!!

// 읽기 함수
function readModbus(slaveId, address, length, description) {
  try {
    client.setID(slaveId)
    //const data = client.readHoldingRegisters(address, length);
    //const data = client.readInputRegisters(address, length);

    //트랜스미터 데이터
    if (slaveId === 11 || slaveId === 12){
      console.log('slaveId: ', slaveId);
      let prefix = '';
      slaveId === 11 ? prefix = '급기' : prefix = '배기'
      console.log(1);
      const data = client.readHoldingRegisters(address, length);
      console.log(data.data);
      const transmitterData = convertArrayForTransmitter(data.data);
      console.log(3);
      if(description === '온도') console.log(`${prefix} ${description} Value: ${transmitterData.toFixed(1)}`);
      else console.log(`${prefix} ${description} Value: ${transmitterData}`);

    }

    //SMD SMU 데이터
    else if (slaveId === 21 || slaveId === 22 || slaveId === 23 || slaveId === 24) {
      console.log('slaveId: ', slaveId);
      let prefix = '';
      switch (slaveId) {
          case 21:
            prefix = 'Room1 SMD'
            break;
          case 22:
            prefix = 'Room1 SMU'
            break;
          case 22:
            prefix = 'Room2 SMD'
            break;
          case 22:
            prefix = 'Room2 SMU'
            break;
          default:
            prefix = ''
      }

      const holdingRegisterdata = client.readHoldingRegisters(address, 21); //length 수정 필요!

      for(let addressDescription of smdsmuRegisterDescriptions.holdingRegisterDescriptions) {
        console.log(`${prefix} ${holdingRegisterdata.data[addressDescription.description]}: ${holdingRegisterdata.data[addressDescription.address]}`)
      }

      const InputRegisterData = client.readInputRegisters(address, 10); //length 수정 필요! 15이상 읽었을 때 에러 안나는지 확인

      for(let addressDescription of smdsmuRegisterDescriptions.inputRegisterDescriptions) {
        console.log(`${prefix} ${InputRegisterData.data[addressDescription.description]}: ${InputRegisterData.data[addressDescription.address]}`)
      }


    }

    //파워미터 데이터
    else if ( slaveId === 13 ){
      console.log('slaveId: ', slaveId);
      const powermetterData = client.readHoldingRegisters(address, length).data;
      const watth = powermetterData[1];
      const voltage = convertArrayForPowermetter([powermetterData[4],powermetterData[5],0,0]);
      const current = convertArrayForPowermetter([powermetterData[10],powermetterData[11],0,0]);
      const watt = powermetterData[17];
      console.log(`유효전력량: ${watth}`)
      console.log(`전압: ${voltage}`)
      console.log(`전류: ${current}`)
      console.log(`유효전력: ${watt}`)
    }

    return null;
    
  } catch (err) {
    console.error('Error reading data:', err);
    return null;
  }
}

// 쓰기 함수
//function writeModbus(slaveId, address, value) {
function writeModbus(room, device, func, input) {
  try {
    let { slaveId, address, value } = convertToControlParams(room, device, func, input)
    console.log(`slaveId: ${slaveId}, address: ${address}, value: ${value}`)
    client.setID(slaveId);
    const response = client.writeRegister(address, value);
    console.log('Data written successfully: ',response);
    return response;
  } catch (err) {
    console.error('Error writing data:', err);
    return err.message;
  }
}


// 연결 후 읽기와 쓰기 호출
function performModbusActions(RegisterArray) {
  //connectModbus();
  //writeModbus(slaveId=1,address=0,value=555);
  //readModbus(13, 0, 15); //slaveID 2, 주소 1에서 5개의 레지스터 읽기
  //console.log('=======================================')
  //readModbus(11, 7010, 4, description='급기 풍량');
  //readModbus(11, 7040, 4, description='급기 온도');
  //readModbus(11, 7070, 4, description='급기 Co2');
  //console.log('=======================================')
  try {
    for (let element of RegisterArray) {
      console.log(element);
      readModbus(element.slaveId, element.length, element.description)
    }    
  } catch (error) {
    console.log('modbusActionError: ',error);
  }

}

connectModbus();
setInterval(() => {
  performModbusActions(transmitterRegisterArray);
  //performModbusActions(smdRegisterArray);
  //performModbusActions(smuRegisterArray);
  //performModbusActions(powermeterRegisterArray);

}, 1000);

module.exports = { connectModbus, readModbus, writeModbus, performModbusActions };
