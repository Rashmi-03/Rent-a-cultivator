import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './backend/routes/auth.js';
import bcrypt from 'bcryptjs';
import User from './backend/models/User.js';
import Machine from './backend/models/machine.js';

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
      res.json({ 
        status: 'ok', 
        dbConnected: connectionState === 1,
        connectionState: connectionState,
        message: connectionState === 1 ? 'Connected to MongoDB' : 'Not connected to MongoDB'
      });
    });

    // Test database connection with machine model
    app.get('/test-db', async (req, res) => {
      try {
        const connectionState = mongoose.connection.readyState;
        if (connectionState !== 1) {
          return res.status(500).json({ 
            error: 'Database not connected', 
            connectionState: connectionState 
          });
        }
        
        // Test if we can create a machine document (without saving)
        const testMachine = new Machine({
          name: 'Test Machine',
          category: 'Test',
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          hourlyRate: 100,
          dailyRate: 800,
          location: 'Test Location',
          description: 'Test Description'
        });
        
        // Test if validation passes
        await testMachine.validate();
        
        res.json({ 
          status: 'Database connection and model validation successful',
          connectionState: connectionState,
          modelValidation: 'passed'
        });
      } catch (error) {
        res.status(500).json({ 
          error: 'Database test failed', 
          message: error.message,
          connectionState: mongoose.connection.readyState
        });
      }
    });

    app.use('/api/auth', authRouter);

    // Machine routes
    app.post('/api/machines', async (req, res) => {
      try {
        console.log('Received machine creation request:', req.body);
        
        const {
          name,
          category,
          image,
          hourlyRate,
          dailyRate,
          available,
          rating,
          location,
          description,
          features,
          stock
        } = req.body;

        console.log('Validating required fields...');
        if (!name || !category || !image || !hourlyRate || !dailyRate || !location || !description) {
          console.log('Missing fields:', { name: !!name, category: !!category, image: !!image, hourlyRate: !!hourlyRate, dailyRate: !!dailyRate, location: !!location, description: !!description });
          return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate image data (should be base64 string)
        if (!image.startsWith('data:image/')) {
          return res.status(400).json({ message: 'Invalid image format. Must be a valid image file.' });
        }

        // Validate image size (base64 strings are about 33% larger than original file)
        if (image.length > 10000000) { // ~10MB limit
          return res.status(400).json({ message: 'Image too large. Please use an image smaller than 7MB.' });
        }

        // Validate pricing
        if (hourlyRate < 0 || dailyRate < 0) {
          return res.status(400).json({ message: 'Pricing must be positive numbers' });
        }

        const newMachine = new Machine({
          name: name.trim(),
          category: category.trim(),
          image,
          hourlyRate,
          dailyRate,
          available: available !== undefined ? available : true,
          rating: rating || 4.0,
          location: location.trim(),
          description: description.trim(),
          features: features || [],
          stock: stock || 1
        });

        const savedMachine = await newMachine.save();
        res.status(201).json(savedMachine);
      } catch (error) {
        console.error('Error creating machine:', error);
        res.status(500).json({ message: 'Failed to create machine' });
      }
    });

    app.get('/api/machines', async (req, res) => {
      try {
        const machines = await Machine.find().sort({ createdAt: -1 });
        res.json(machines);
      } catch (error) {
        console.error('Error fetching machines:', error);
        res.status(500).json({ message: 'Failed to fetch machines' });
      }
    });

    app.get('/api/machines/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const machine = await Machine.findById(id);
        
        if (!machine) {
          return res.status(404).json({ message: 'Machine not found' });
        }
        
        res.json(machine);
      } catch (error) {
        console.error('Error fetching machine:', error);
        res.status(500).json({ message: 'Failed to fetch machine' });
      }
    });

    app.put('/api/machines/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        
        const updatedMachine = await Machine.findByIdAndUpdate(
          id,
          updates,
          { new: true, runValidators: true }
        );
        
        if (!updatedMachine) {
          return res.status(404).json({ message: 'Machine not found' });
        }
        
        res.json(updatedMachine);
      } catch (error) {
        console.error('Error updating machine:', error);
        res.status(500).json({ message: 'Failed to update machine' });
      }
    });

    app.delete('/api/machines/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const deletedMachine = await Machine.findByIdAndDelete(id);
        
        if (!deletedMachine) {
          return res.status(404).json({ message: 'Machine not found' });
        }
        
        res.json({ message: 'Machine deleted successfully' });
      } catch (error) {
        console.error('Error deleting machine:', error);
        res.status(500).json({ message: 'Failed to delete machine' });
      }
    });

    // Serve static files from the frontend build (uncomment for production)
    // app.use(express.static(path.join(__dirname, 'dist')));

    // Handle all other routes for SPA (uncomment for production)
    // app.get(['/', '/dashboard', '/machines', '/bookings', '/profile'], (req, res) => {
    //   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    // });
    
    // Final catch-all for any other routes (uncomment for production)
    // app.get('*', (req, res) => {
    //   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    // });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB or start server:', error);
    process.exit(1);
  }
}

startServer();

