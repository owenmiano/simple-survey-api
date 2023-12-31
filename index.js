const express=require('express')
require('dotenv').config()
const cors=require('cors')
const app =express();
const fileUpload = require('express-fileupload');
const question=require('./server/routes/question')
const morgan =require('morgan')
const port=process.env.PORT;
const {connectDB}=require("./server/dbCon")


// Initialize  middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(fileUpload());

// Serve PDFS from the "uploads" directory
app.use('/uploads', express.static('uploads'));

//  APIS
app.use('/api',question)
if(process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'))
}

const startServer = () => {
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  };

// Run the createTables function and start the server after tables are created
connectDB().then(startServer);
