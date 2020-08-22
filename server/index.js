const express=require('express')
const app=express()
const port=5000
const bodyParser=require('body-parser')
const moongose = require('mongoose')
const {User}=require('./models/User')
const config = require('./config/key')
const cookieParser=require('cookie-parser')
app.use(cookieParser())
const {auth}=require('./middleware/auth')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
moongose.connect(config.mongoURI,{useUnifiedTopology:true,useCreateIndex: true, useFindAndModify:false}).then(()=>console.log('mongodb connected..')).catch(err=>console.log(err))
app.get('/',(req,res)=>res.send('hi'))
app.post('/api/users/register',(req,res)=>{
    const user=new User(req.body)
    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({

            success:true
        })
    })
})
app.post('/api/users/login',(req,res)=>{
    //요청된 이메일을 db에 있는지 찾기
    User.findOne({email: req.body.email},(err,user)=>{
        if(!user){
        return res.json({
            loginSuccess:false,
            message:"제공된 이메일에 해당하는 유저가 없다."
        })
        }
        console.log('ok')
        user.comparePassword(req.body.password,(err,isMatch)=>{
            
            if(!isMatch){
                console.log('1')
                return res.json({loginSuccess:false,message:"비밀번호 틀림"})
            }
            user.generateToken((err,user)=>{
                console.log(user)
                if(err) return res.status(400).send(err)
                res.cookie('x_auth',user.token).status(200).json({loginSuccess:true,userId:user._id})
            })

        })
    })
    //비밀번호와 찾은 이메일이 같은지 확인
    //비밀번호까지 맞으면 유저를 위한 token 생성
})
app.get('/api/users/auth',auth,(req,res)=>{
    console.log('a')
    //여기 까지 미들웨어를 통과해 왔다=>authentication이 true
    res.status(200).json({
        _id:req.user._id,
        isAdmin:req.user.role===0?false :true,
        isAuth:true,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname,
        role:req.user.role,
        image:req.user.image
    })

})

app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},
        {token:""},(err,user)=>{
            if(err) return res.json({success:false,err})
            return res.status(200).send({
                success:true
            })
        })
})
app.get('/api/hello',(requset,response)=>{
    response.send('hello')
})
app.listen(port,()=>console.log(`application listening at${port}`))