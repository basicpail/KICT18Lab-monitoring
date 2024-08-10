transmitterRegisterArray = [
    {
        slaveId: 11,
        address: 7010,
        length: 4,
        description: '급기 풍량'    
    },
    {
        slaveId: 11,
        address: 7040,
        length: 4,
        description: '급기 온도'    
    },
    {
        slaveId: 11,
        address: 7070,
        length: 4,
        description: '급기 Co2'    
    },
    {
        slaveId: 12,
        address: 7010,
        length: 4,
        description: '급기 풍량'    
    },
    {
        slaveId: 12,
        address: 7040,
        length: 4,
        description: '급기 온도'    
    },
    {
        slaveId: 12,
        address: 7070,
        length: 4,
        description: '급기 Co2'    
    }
]

smdRegisterArray = [
    {
        slaveId: 21,
        address: 0,
        length: 21,
        description: '급기 Room1 SMD'    
    },
    {
        slaveId: 23,
        address: 0,
        length: 21,
        description: '급기 Room2 SMD'    
    }
]

smuRegisterArray = [
    {
        slaveId: 22,
        address: 0,
        length: 21,
        description: '배기 Room1 SMU'    
    },
    {
        slaveId: 24,
        address: 0,
        length: 21,
        description: '배기 Room2 SMU'    
    }
]

smdsmuRegisterDescriptions = {
    holdingRegisterDescriptions: [
            {
                address: 0,
                description: '디퓨저 모드'
            },
            {
                address: 7,
                description: '디퓨저 목표 개도 값'
            },
            {
                address: 10,
                description: '설정 풍량'
            },
            {
                address: 13,
                description: '풍량제어 제어시간 간격'
            },
            {
                address: 14,
                description: '풍량제어 목표도달 판단기준값'
            },
            {
                address: 15,
                description: '풍량제어 디퓨저 개도 위치 조정값'
            },
            {
                address: 20,
                description: '설정온도'
            },
            {
                address: 21,
                description: '온도제어 제어시간 간격'
            }
        ],
    inputRegisterDescriptions: [
            {
                address: 7,
                description: '현재 개도 값'
            },
            {
                address: 8,
                //description: '풍량 확인용 FAN 회전 RPM'
                description: 'FAN RPM'
            },
            {
                address: 9,
                description: '현재풍량'
            },
            {
                address: 10,
                description: '실내온도'
            },
            {
                address: 11,
                description: '공급 대기 온도'
            },
            {
                address: 12,
                description: 'Co2농도'
            },
        ]
}


powermeterRegisterArray =[
    {
        slaveId: 13,
        address: 0,
        length: 20,
        description: 'Powermetter'    
    },
]

airmonitorDevices = [
    '73876dc8-569a-5de6-66f2-90fd1d89699a',
    //18동 룸1 공기질 센서0
    'c90805f1-2f1f-1873-56bf-1205f252cc9d',
    //18돌 룸1 공기질 센서1
    '07f2922c-4962-108e-bef6-ba6b57e2048e',
    //18동 룸1 공기질 센서2
    '5841eacc-00ec-0b2f-0548-8e7ed888712e',
    //18동 룸2 공기질 센서0
    'b5f96156-10e0-c395-196e-15b90a26c226',
    //18동 룸2 공기질 센서1
    'dc9ac978-8fd4-06f7-e6cd-c7b9f9b401a4',
    //18동 룸2 공기질 센서2
]



module.exports = { transmitterRegisterArray,smdRegisterArray,smuRegisterArray, smdsmuRegisterDescriptions, powermeterRegisterArray,
    BASE_URL: 'https://api.smartthings.com/v1/devices',
    ST_TOKEN: '82350e11-3996-43d3-bd26-02021b40f0b3',
    DEVICE_IDS: airmonitorDevices
 };