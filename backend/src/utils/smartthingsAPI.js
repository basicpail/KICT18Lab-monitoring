const axios = require('axios');
const {ST_TOKEN, BASE_URL, DEVICE_IDS } = require('./const');
const { saveAirmonitorData} = require('../models/Device');


// AirMonitorClient 클래스 정의
class AirMonitorClient {
    constructor(token, baseUrl, deviceIds) {
        this.token = token;
        this.baseUrl = baseUrl;
        this.device_ids = deviceIds;
        this.headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
    }

    async makeAuthenticatedGetRequest(deviceId, endpoint) {
        const url = `${this.baseUrl}/${deviceId}/${endpoint}`;
        try {
            const response = await axios.get(url, { headers: this.headers });
            return response.data;
        } catch (error) {
            console.error(`HTTP request failed: ${error.message}`);
            throw error;
        }
    }
}


// 메인 비동기 함수
async function STClient() {
    const client = new AirMonitorClient(ST_TOKEN, BASE_URL, DEVICE_IDS);
    const responseArray =[];

    try {
        for (const deviceId of client.device_ids) {
            try {
                const responseGet = await client.makeAuthenticatedGetRequest(deviceId, 'states');
                const responseDict = {
                    device_id: deviceId,
                    temperature: responseGet.main.temperature.value,
                    humidity: responseGet.main.humidity.value,
                    pm10: responseGet.main.dustLevel.value,
                    pm2d5: responseGet.main.fineDustLevel.value,
                    pm1d0: responseGet.main.veryFineDustLevel.value,
                    co2: responseGet.main.carbonDioxide.value,
                    gas: responseGet.main.odorLevel.value
                };
                responseArray.push(responseDict);
                saveAirmonitorData(responseDict,responseDict.device_id)
                //console.log(`Response_dict: ${JSON.stringify(responseDict)}`);
            } catch (error) {
                console.error(`Device ${deviceId} processing failed: ${error.message}`);
            }
        }
        //console.log('response: ', responseArray)
        return responseArray
    } catch (error) {
        console.error(`Main function error: ${error.message}`);
    }
}

// 프로그램 시작
//main().catch(error => console.error(`Main function error: ${error.message}`));

module.exports = { STClient };
