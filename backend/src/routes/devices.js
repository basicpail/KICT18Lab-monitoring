const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const fastcsv = require('fast-csv');
const auth = require('../middleware/auth');
const { connectModbus, readModbus, writeModbus, performModbusActions } = require('../utils/modbusUtils');
const { STClient } = require('../utils/smartthingsAPI');
//const { default: axiosInstance } = require('../../../frontend/src/utils/axios');
const {Device} = require('../models/Device');


router.post('/control' , async (req, res, next) => {
    try {
        // const data = await axios.post('http://119.30.150.230:4000/devices/control',{
        //     selectedRoom: req.body.selectedRoom,
        //     selectedDevice: req.body.selectedDevice,
        //     selectedFunction: req.body.selectedFunction,
        //     inputValue: req.body.inputValue
        // })
        // console.log(`${req.body.selectedcategory}, ${req.body.selectedDevice}, ${req.body.selectedFunction}, ${req.body.inputValue}`);
        const response = await writeModbus(
            req.body.selectedRoom, req.body.selectedDevice, req.body.selectedFunction, req.body.inputValue
        );
        //return res.status(200).json({'response':response})
        return res.status(200).send(response)

    } catch (error) {
        next(error);
    }
})

router.get('/requestAllDeviceData', async (req, res, next) => {
    try {
        //const data = await axios.get('http://119.30.150.230:4000/devices/requestAllDeviceData')
        const data = await performModbusActions();

        if (!data || data.length === 0) {
            return res.status(500);
        }

        const device = new Device(data);
        await device.save();

        //return res.json({deviceDataArray: data})
        return res.json(data)

    } catch (error) {
        next(error);
    }
})


router.get('/requestAllDeviceDataAPI', async (req, res, next) => {
    try {
        //const data = await axios.get('http://119.30.150.230:4000/devices/requestAllDeviceData')
        const data = await performModbusActions();

        //console.log('data: ',data);
        if (!data || data.length === 0) {
            return res.status(500);
        }

        //const device = new Device(data);
        //await device.save();

        return res.json(data)

    } catch (error) {
        next(error);
    }
})

router.get('/requestSTAirmonitor', async (req, res, next) => {
    try {
        //const data = await axios.get('http://119.30.150.230:4000/devices/requestAllDeviceData')
        const data = await STClient();

        //console.log('data: ',data);
        if (!data || data.length === 0) {
            return res.status(500);
        }

        return res.json({'data':data})

    } catch (error) {
        next(error);
    }
})


// 데이터 조회 및 변환 함수
router.post('/insertDeviceDataToDB', async (req, res, next) => {
    try {
        const { startDate, endDate, selectedDataList } = req.body;
        const data = await getData(startDate, endDate, selectedDataList);

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No data found" });
        }

        const groupedData = {};
        data.forEach(entry => {
            if (!groupedData[entry.date]) {
                groupedData[entry.date] = { Date: entry.date };
            }
            groupedData[entry.date][entry.type] = entry.value;
        });

        // 그룹화된 데이터를 행으로 변환합니다.
        const rows = Object.values(groupedData);
        return res.send({'data':rows})
    
        // const now = new Date();
        // const timestamp = now.toISOString().replace(/:/g, '-').slice(0, 19);
        // const filePath = path.join(process.env.CSV_PATH, `${timestamp}.csv`);
        // const ws = fs.createWriteStream(filePath, { encoding: 'utf8' });
        // ws.write('\ufeff'); //한글 깨짐 처리
        // fastcsv
        //     .write(rows, { headers: true })
        //     .pipe(ws)
        //     .on('finish', () => {
        //         res.json({ message: "Data saved successfully", filePath });
        //     })
        //     .on('error', (error) => {
        //         console.error('Error writing CSV file:', error);
        //         res.status(500).json({ error: "Failed to save data" });
        //     });
    
    } catch (error) {
        next(error);
    }
})

router.post('/getDeviceDataFromDB', async (req, res, next) => {
    try {
        const { startDate, endDate, selectedDataList } = req.body;
        /*console.log(`${startDate} ${endDate} ${selectedDataList}`)*/
        const data = await getData(startDate, endDate, selectedDataList);
        res.json(data);

    } catch (error) {
        next(error);
    }
})

async function getData(startDate, endDate, selectedDataList) {
    const data = await Device.find({
      //createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      createdAt: { $gte: startDate+':00Z', $lte: endDate+':00Z' }
    });
  
    const result = [];
    data.forEach(doc => {
        const dateStr = new Date(doc.createdAt).toISOString().slice(0, 19);
        //const dateStr = new Date(doc.createdAt).toISOString().replace('T', ' ').slice(0, 19);
        //const dateStr = new Date(doc.createdAt);
        //console.log('dateStr: ', dateStr);
        selectedDataList.forEach(selected => {
            let [category, device, ...parameterArray] = selected.split(' ');
            let parameter = parameterArray.join(' ');
            //console.log('category: ', category);
            //console.log('device: ', device);
            //console.log('parameter: ', parameter);
            if (category === 'Room1' || category === 'Room2') {
                result.push({
                    date: dateStr,
                    value: doc[category][device][parameter],
                    type: `${category} ${device} ${parameter}`
                });                
            }
            else {
                if (['급기풍량', '급기온도', '급기Co2', '배기풍량', '배기온도', '배기Co2'].includes(category)){
                    result.push({
                        date: dateStr,
                        value: doc['transmitter'][category],
                        type: `${category}`
                    }); 
                }
                else if (['누적전력량', '전압', '전류', '전력'].includes(category)){
                    result.push({
                        date: dateStr,
                        value: doc['powermeter'][category],
                        type: `${category}`
                    }); 
                }               
            }
            // if (doc[category] && doc[category][device] && doc[category][device][parameter] !== undefined) {
            //     result.push({
            //         date: dateStr,
            //         value: doc[category][device][parameter],
            //         type: `${category} ${device} ${parameter}`
            //     });
            // }
        });
    });
  
    return result;
}

module.exports = router;