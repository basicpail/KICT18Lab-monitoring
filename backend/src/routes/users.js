const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/register', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });        
        if(!user) {
            //return res.status(400).send("Auth failed, email not found");
            return res.status(400).send("로그인 실패, 없는 이메일");
        }

        const isMatch = await user.comparePassword(req.body.password);
        if(!isMatch) {
            //return res.status(400).send('Auth failed, Wrong password');
            return res.status(400).send('로그인 실패, 잘못된 비밀번호');
        }

        const payload = {
            userId: user._id.toHexString(), //MongoDB의 id는 Object로 되어 있기 때문에 toHexString 메서드를 써준다.
        }
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 1000*60*60})
        
        //return res.json({ user:user, accessToken:accessToken })
        return res.json({ user, accessToken })
    } catch (error) {
        next(error)
    }
})

router.get('/auth', auth , async (req, res, next) => {
    return res.json({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    })
})

router.post('/logout', auth, async (req, res, next) => {
    try {
        return res.sendStatus(200); // auth 미들웨어 통과했으면 올바른 유저니 바로 200 리턴
    } catch (error) {
        next(error);  
    }
})


module.exports = router;