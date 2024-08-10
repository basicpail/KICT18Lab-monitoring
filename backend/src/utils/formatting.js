//32bit-float little-endian bytes swap
//ex)[32768,17638,0,0] -> [0X8000,0X44E6,0,0] -> [0X44E6,0X8000,0,0] -> [ 0X44, 0Xe6, 0X80, 0X00 ] -> 1844
function convertArrayForTransmitter(inputArray){
    if (inputArray.length !== 4) {
        throw new Error('배열의 요소는 4개여야 합니다.');
    }

    // 16진수로 변환
    const hexArray = inputArray.map(num => '0x' + num.toString(16).toUpperCase());

    // swap
    const swappedArray = [hexArray[1], hexArray[0], hexArray[2], hexArray[3]];

    // 2바이트로 나누어 배열 생성
    const dividedArray = [];
    for (let i = 0; i < swappedArray.length; i++) {
        const hexValue = swappedArray[i].substring(2); // "0x" 제거
        dividedArray.push('0X' + hexValue.substring(0, 2)); // 상위 1바이트
        dividedArray.push('0X' + hexValue.substring(2));   // 하위 1바이트
    }

    // 출력 배열이 4개의 요소를 가지도록 조정
    while (dividedArray.length > 4) {
        dividedArray.pop();
    }
    while (dividedArray.length < 4) {
        dividedArray.push('0x00');
    }

    var buffer = new ArrayBuffer(4); // 4바이트 버퍼 생성
    var view = new DataView(buffer); // 버퍼로부터 DataView 생성
    dividedArray.forEach(function (byte, i) { // 바이트 배열을 DataView에 설정
        view.setUint8(i, byte);
    });
    return view.getFloat32(0); // DataView를 통해 부동 소수점을 가져옴
}

//[17245,39322,0,0] -> 221.4
function convertArrayForPowermetter(inputArray){
    if (inputArray.length !== 4) {
        throw new Error('배열의 요소는 4개여야 합니다.');
    }

    // 16진수로 변환
    const hexArray = inputArray.map(num => '0x' + num.toString(16).toUpperCase());


    // 2바이트로 나누어 배열 생성
    const dividedArray = [];
    for (let i = 0; i < hexArray.length; i++) {
        const hexValue = hexArray[i].substring(2); // "0x" 제거
        dividedArray.push('0X' + hexValue.substring(0, 2)); // 상위 1바이트
        dividedArray.push('0X' + hexValue.substring(2));   // 하위 1바이트
    }

    // 출력 배열이 4개의 요소를 가지도록 조정
    while (dividedArray.length > 4) {
        dividedArray.pop();
    }
    while (dividedArray.length < 4) {
        dividedArray.push('0x00');
    }

    var buffer = new ArrayBuffer(4); // 4바이트 버퍼 생성
    var view = new DataView(buffer); // 버퍼로부터 DataView 생성
    dividedArray.forEach(function (byte, i) { // 바이트 배열을 DataView에 설정
        view.setUint8(i, byte);
    });
    return view.getFloat32(0).toFixed(1); // DataView를 통해 부동 소수점을 가져옴
}



function convertToControlParams(room, device, func, input){
    let slaveId;
    let address;
    let value;
    
    if (room === 'room1' && device === 'smd') {
        slaveId = 21;
    } else if (room === 'room1' && device === 'smu') {
        slaveId = 22;
    } else if (room === 'room2' && device === 'smd') {
        slaveId = 23;
    } else if (room === 'room2' && device === 'smu') {
        slaveId = 24;
    } else {
        throw new Error('Invalid Control Params');
    }

    address = parseInt(func);
    value = parseInt(input);


    return {slaveId, address, value}

}

//console.log(convertArrayForPowermetter([17245,39322,0,0]))

module.exports = { convertArrayForTransmitter, convertArrayForPowermetter, convertToControlParams };