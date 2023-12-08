const dotenv = require('dotenv');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');

dotenv.config({
    path:'./.env'
})

const app = express();



const location = path.join(__dirname,"public");
app.use(express.static(location));
app.set("view engine","hbs");

const db = mysql.createConnection(
   {
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
   }
);
db.connect((err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("db connected")
    }
})
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));


app.use("/",require("./routes/pages"));

app.use('/auth',require('./routes/auth'));

// Router Express


app.listen(4000,()=>{
    console.log("server start")
})