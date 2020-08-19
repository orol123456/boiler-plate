const express=require('express')
const app=express()
const port=5000
const moongose = require('mongoose')
moongose.connect('mongodb+srv://jonghyuk:abcd1234@boilerplate.kcjzj.mongodb.net/<dbname>?retryWrites=true&w=majority',{
useUnifiedTopology:true,useCreateIndex: true, useFindAndModify:false}).then(()=>console.log('mongodb connected..')).catch(err=>console.log(err))
app.get('/',(req,res)=>res.send('hi'))
app.listen(port,()=>console.log(`app listening at${port}`))