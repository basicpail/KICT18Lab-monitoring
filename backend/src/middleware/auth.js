const jwt = require('jsonwebtoken');
const User = require('../models/User');

let auth = async (req, res, next) => {
    //token 을 request headers에서 가져오기
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if(token === null ) return res.sendStatus(401);

    try {
        //토큰이 유효한지 확인
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ "_id": decode.userId });//jwt 만들 때 payload에 userId를 넣어 줬기 때문에 가능함
        if(!user) {
            return res.status(400).send('user not exist');
        }
        req.user = user; //routes.js의 auth의 req에 들어가는것임
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = auth;