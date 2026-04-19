const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/SESD', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    console.log(users);
    process.exit(0);
  });
