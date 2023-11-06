const express=require('express')
require('dotenv').config()
const cors=require('cors')
const app =express();
const fileUpload = require('express-fileupload');
const question=require('./server/routes/question')
const port=process.env.PORT;


const {sequelize}=require("./server/dbCon")

// Initialize  middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(fileUpload());

// Serve PDFS from the "uploads" directory
app.use('/uploads', express.static('uploads'));

//  APIS
app.use('/api',question)

sequelize.sync().then(result=>{

    app.listen(port,console.log(`Server is running in ${process.env.NODE_ENV} mode on port:${port}`))
}).catch(err => {
    console.log(err);
})
