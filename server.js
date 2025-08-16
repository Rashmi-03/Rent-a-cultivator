import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './backend/routes/auth.js';
import bcrypt from 'bcryptjs';
import User from './backend/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

    // Create a default admin if not present
    const ensureAdminUser = async () => {
      const adminName = process.env.ADMIN_NAME || 'Admin';
      const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim();
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

      let adminUser = await User.findOne({ email: adminEmail });
      if (!adminUser) {
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        adminUser = await User.create({
          name: adminName,
          email: adminEmail,
          phone: process.env.ADMIN_PHONE || '0000000000',
          passwordHash,
          role: 'admin',
        });
        console.log(`Default admin created: ${adminEmail}`);
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log(`Existing user promoted to admin: ${adminEmail}`);
      }
    };
    await ensureAdminUser();

    app.get('/health', (req, res) => {
      const connectionState = mongoose.connection.readyState; // 1 = connected
      res.json({ status: 'ok', dbConnected: connectionState === 1 });
    });

    app.use('/api/auth', authRouter);

    // Serve static files from the frontend build
    app.use(express.static(path.join(__dirname, 'dist')));

    // Handle all other routes for SPA
    app.get(['/', '/dashboard', '/machines', '/bookings', '/profile'], (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
    
    // Final catch-all for any other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB or start server:', error);
    process.exit(1);
  }
}

startServer();

