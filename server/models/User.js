const mongoose=require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds=10
const jwt=require('jsonwebtoken')
const userSchema=mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    image: String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }

})
userSchema.pre('save',function(next){
        var user = this
        //password encription with mongoose framework
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) {
                console.log('err')
                return next(err)
            }
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err)
                user.password = hash
                console.log(user)
                next()
                })
            })
})

userSchema.statics.findByToken=function(token,cb){
    console.log(token)
    var user=this
    //토큰을 decode한다.
    jwt.verify(token,'secretToken',function(err,decoded){
        //유저아이디를 이용해 유저를 찾고 클라이언트에서 가져온 토큰과db안의 토큰 일치확인
        user.findOne({"_id":decoded,"token":token},function(err,user){
            if(err) return cb(err)
            cb(null,user)
        })
    })
}
userSchema.methods.generateToken=function(cb){
    var user=this
    //jsonwebtoken을 이용해서 token생성
    var token= jwt.sign(user._id.toHexString(),'secretToken')
    user.token=token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)

    })


}
userSchema.methods.comparePassword=function(plainPassword,cb){
    console.log(plainPassword)
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err){
            return cb(err)
        }
        console.log(isMatch)
        cb(null,isMatch)
    })

}
const User=mongoose.model('User',userSchema)
module.exports={User}