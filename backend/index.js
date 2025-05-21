require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const router = require('./routes/routes')


const app = express()
app.use(cors({
  origin: 'https://attendance-management-kappa.vercel.app', // or your frontend URL
  credentials: true
}));
app.use(express.json())


app.use('/api',router);


const PORT = process.env.PORT || 3000

connectDB().then(()=>{
    app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
})
