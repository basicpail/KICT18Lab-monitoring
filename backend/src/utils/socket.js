const socketIo = require('socket.io');
const { connectModbus, readModbus, writeModbus, performModbusActions } = require('./modbusUtils');
const { Device} = require('../models/Device');

let dataCache = {}; // 주기적인 작업 결과를 저장할 변수

const performModbusActionsWithTimeout = (timeout) => {
  return Promise.race([
    performModbusActions(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
  ]);
};

const setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      //origin: 'http://192.168.0.100:5174',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  });
  
  // 주기적인 작업 설정 (예: 매 분마다 실행)
    //dataCache = { message: `Updated at ${new Date().toISOString()}` };
  setInterval(async () => { // 콜백 함수를 async로 변경
    try {
      dataCache = await performModbusActions();
      //console.log('Data updated:', dataCache);
      const device = new Device(dataCache);
      await device.save();
      io.emit('update', dataCache); // 모든 클라이언트에게 업데이트된 데이터 전송
    } catch (error) {
      console.error('Error performing Modbus actions:', error);
    }
  }, 3000);

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('update', dataCache); // 연결된 클라이언트에게 현재 데이터 전송

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = setupSocket;
