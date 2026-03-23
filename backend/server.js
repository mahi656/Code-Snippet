const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const githubAuthRouter = require('./OAuth/Auth.Github.js');

dotenv.config()
const app = express()
app.use(cors())
app.use('/OAuth', githubAuthRouter)

const PORT = 5001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})