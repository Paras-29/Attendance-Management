require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const router = require('./routes/routes')


const app = express()

// CORS configuration
const allowedOrigins = [
  'https://attendance-management-kappa.vercel.app',
  'http://localhost:5173' // Keep localhost for development
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
