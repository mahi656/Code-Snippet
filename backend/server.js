const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const githubAuthRouter = require('./OAuth/Auth.Github.js');

dotenv.config()
const app = express()

// Connect to Database
connectDB();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/OAuth', githubAuthRouter)

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});