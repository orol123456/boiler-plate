const express=require('express')
const app=express()
const port=5000
const bodyParser=require('body-parser')
const moongose = require('mongoose')
const {User}=require('./models/User')
const config = require('./config/key')
const cookieParser=require('cookie-parser')
app.use(cookieParser())

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
moongose.connect(config.mongoURI,{useUnifiedTopology:true,useCreateIndex: true, useFindAndModify:false}).then(()=>console.log('mongodb connected..')).catch(err=>console.log(err))
app.get('/',(req,res)=>res.send('hi'))
app.post('/register',(req,res)=>{
    const user=new User(req.body)
    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        console.log(userInfo)
        return res.status(200).json({

            success:true
        })
    })
})
app.post('/login',(req,res)=>{
    //요청된 이메일을 db에 있는지 찾기
    User.findOne({email: req.body.email},(err,user)=>{
        if(!user){
        return res.json({
            loginSuccess:false,
            message:"제공된 이메일에 해당하는 유저가 없다."
        })
        }
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch)
                return res.json({loginSuccess:false,message:"비밀번호 틀림"})
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err)
                res.cookie('x_auth',user.token).status(200).json({loginSuccess:true,userId:user._id})
            })

        })
    })
    //비밀번호와 찾은 이메일이 같은지 확인
    //비밀번호까지 맞으면 유저를 위한 token 생성
})
app.listen(port,()=>console.log(`application listening at${port}`))