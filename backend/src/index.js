const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'.env'});
const port = 4000;
const http = require('http');
const server = http.createServer(app);
const setupSocket = require('./utils/socket');
const {connectModbus, performModbusActions } = require('./utils/modbusUtils');

app.use(express.static(path.join(__dirname, 'uploads' ))); //절대경로를 사용하기 위함임, 실행명령을 입력하는 경로에 따라서 상대적인 경로가 지정되어 버리니까?
app.use(cors());
// app.options('*', cors());
// app.use(function (req, res, next) {
//     if (req.method === 'OPTIONS') {
//         console.log('OPTION Request!')
//         return res.sendStatus(200);
//       }
//     next();
// })
// app.use(cors({
//     origin: 'http://192.168.0.100', // 프론트엔드 도메인
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 허용할 HTTP 메서드
//     allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
//     credentials: true,
//     optionsSuccessStatus: 200
// }));
// app.options(cors({
//     origin: 'http://119.30.150.230',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//     optionsSuccessStatus: 200
// }));

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     //res.setHeader('Access-Control-Allow-Origin', 'http://119.30.150.230');
//     res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.100:5174');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });

app.use(express.json());
app.use('/users', require('./routes/users'));
app.use('/devices', require('./routes/devices'));





app.get('/', (req, res) => {
    throw new Error("에러 테스트");
    res.send('Hello, world!!!');
})

//에러처리기 정의
//라우터에서 next를 이용하지 않으면 비동기 요청으로 인한 에러를 처리기에서 받지 못해서 서버가 crash 돼버린다.
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.send(error.message || 'Here is index.js Error Handler');
})

setupSocket(server);

connectModbus();

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('DB Connect!');
    })
    .catch(err=>{
        console.log(`DB connect error: ${err}`)
    })


server.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})