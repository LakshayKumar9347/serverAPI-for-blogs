const express = require('express')
const path = require('path')
const router = express.Router()

router.post('/',(req,res,)=>{
    console.log(req.body);
    
    res.send('msg:welcom to login Enter your user name and pas')
    // next()
})
module.exports=router