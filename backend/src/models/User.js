const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    image: String
})

userSchema.pre('save', async function(next){
    let user = this; //저장하려고하는 user의 데이터가 들어가게됨

    if(user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    next();
});

userSchema.methods.comparePassword = async function(plainPassword) {
    let user = this; //여기서 this는 데이터베이스의 유저 데이터이다.
    const match = bcrypt.compare(plainPassword, user.password); //salt를 어떻게 알고 비교를 하는거야? //boolean 반환
    return match;
}

const User = mongoose.model("USER", userSchema);

module.exports = User;