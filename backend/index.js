import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Create a .env file with MONGODB_URI.');
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    app.get('/health', (req, res) => {
      const connectionState = mongoose.connection.readyState; // 1 = connected
      res.json({ status: 'ok', dbConnected: connectionState === 1 });
    });

    app.use('/api/auth', authRouter);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB or start server:', error);
    process.exit(1);
  }
}



startServer();