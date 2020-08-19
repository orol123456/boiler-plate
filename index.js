const express=require('express')
const app=express()
const port=5000
const bodyParser=require('body-parser')
const moongose = require('mongoose')
const {User}=require('./models/User')
const config = require('./config/key')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
moongose.connect(config.mongoURI,{useUnifiedTopology:true,useCreateIndex: true, useFindAndModify:false}).then(()=>console.log('mongodb connected..')).catch(err=>console.log(err))
app.get('/',(req,res)=>res.send('hi'))
app.post('/register',(req,res)=>{
    const user=new User(req.body)
    user.save((err,doc)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
})
app.listen(port,()=>console.log(`application listening at${port}`))