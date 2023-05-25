const express=require('express');
const app=express();
const path=require('path');
const ejs=require('ejs');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine',ejs);
app.set('views',path.join(__dirname,'views'));

const users=require('./routes/userRoute');
app.use('/api/v1',users);

app.use(express.static('views/public'));

module.exports=app;