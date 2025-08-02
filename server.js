const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/machine', require('./routes/machine'));

// Connect to MongoDB and start server
mongoose.connect('mongodb://localhost:27017/machines', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log('🚀 Server running on port 5000'));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
