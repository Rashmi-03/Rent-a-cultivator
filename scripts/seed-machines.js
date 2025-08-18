import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Machine from '../backend/models/machine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve MongoDB URI similar to server.js
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  try {
    const configPath = path.resolve(process.cwd(), 'config.env');
    const content = fs.readFileSync(configPath, 'utf8');
    const line = content.split('\n').find(l => l.startsWith('MONGODB_URI='));
    if (line) {
      MONGODB_URI = line.split('=')[1].replace(/"/g, '').trim();
      console.log('✅ Loaded MongoDB URI from config.env');
    }
  } catch (e) {
    // fallback to local
  }
}
if (!MONGODB_URI) {
  MONGODB_URI = 'mongodb://localhost:27017/rent-a-cultivator';
  console.log('ℹ️ Using default local MongoDB URI');
}

// Tiny base64 PNG placeholder (1x1 px)
const tinyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

// Source of truth: default machine catalog
const defaultMachines = [
  { name: 'John Deere 6120M', category: 'Tractor', hourlyRate: 800, dailyRate: 6000, available: true, rating: 4.8, location: 'Downtown Farm Equipment', description: 'High-performance tractor with advanced GPS guidance system', features: ['GPS Navigation', 'Climate Control', 'Premium Sound System'], stock: 1 },
  { name: 'Case IH Axial-Flow 250', category: 'Harvester', hourlyRate: 1200, dailyRate: 9000, available: true, rating: 4.6, location: 'North Valley Equipment', description: 'Advanced combine harvester with grain loss monitoring', features: ['Grain Loss Monitor', 'Auto Height Control', 'Yield Mapping'], stock: 1 },
  { name: 'Harvestmaster H12 4WD', category: 'Harvester', hourlyRate: 1000, dailyRate: 7500, available: true, rating: 4.7, location: 'Central Farm Services', description: 'Compact harvester perfect for small to medium farms', features: ['4WD Drive', 'Compact Design', 'Easy Maneuverability'], stock: 1 },
  { name: 'Standard Tractor-Mounted Combine', category: 'Harvester', hourlyRate: 900, dailyRate: 7000, available: false, rating: 4.5, location: 'South Field Equipment', description: 'Versatile tractor-mounted harvester for multiple crops', features: ['Tractor Mounted', 'Multi-Crop', 'Adjustable Header'], stock: 1 },
  { name: 'Front-End Loader', category: 'Loader', hourlyRate: 600, dailyRate: 4500, available: true, rating: 4.4, location: 'West Construction Equipment', description: 'Heavy-duty front-end loader for material handling', features: ['Heavy Duty', 'Quick Attach', 'High Lift Capacity'], stock: 1 },
  { name: 'Mahindra Round Baler', category: 'Baler', hourlyRate: 700, dailyRate: 5500, available: true, rating: 4.3, location: 'East Farm Machinery', description: 'Efficient round baler for hay and straw baling', features: ['Round Baling', 'Auto Tie', 'Adjustable Density'], stock: 1 },
  { name: 'Mahindra Straw Baler', category: 'Baler', hourlyRate: 650, dailyRate: 5000, available: true, rating: 4.2, location: 'Central Farm Services', description: 'Specialized baler for straw and crop residue', features: ['Straw Specific', 'High Capacity', 'Durable Construction'], stock: 1 },
  { name: 'Premium Tractor Unit', category: 'Tractor', hourlyRate: 900, dailyRate: 7000, available: false, rating: 4.9, location: 'Premium Equipment Co.', description: 'Top-of-the-line tractor with luxury features', features: ['Luxury Interior', 'Advanced Tech', 'Premium Warranty'], stock: 1 },
  { name: 'Mahindra Straw Reaper', category: 'Reaper', hourlyRate: 500, dailyRate: 4000, available: true, rating: 4.1, location: 'South Field Equipment', description: 'Efficient straw reaper for crop residue management', features: ['Straw Cutting', 'Adjustable Height', 'Easy Operation'], stock: 1 },
  { name: 'Mahindra Basket Thresher P-990', category: 'Thresher', hourlyRate: 400, dailyRate: 3000, available: true, rating: 4.0, location: 'North Valley Equipment', description: 'Traditional basket thresher for grain processing', features: ['Basket Design', 'Manual Operation', 'Versatile Use'], stock: 1 },
  { name: 'Mahindra Paddy Multi-Thresher P-80', category: 'Thresher', hourlyRate: 450, dailyRate: 3500, available: true, rating: 4.2, location: 'Central Farm Services', description: 'Specialized thresher for paddy and rice crops', features: ['Paddy Specific', 'Multi-Crop', 'High Efficiency'], stock: 1 },
  { name: 'Premium Farm Tractor', category: 'Tractor', hourlyRate: 1000, dailyRate: 8000, available: true, rating: 4.7, location: 'Premium Equipment Co.', description: 'Professional grade tractor for commercial farming', features: ['Commercial Grade', 'High Horsepower', 'Advanced Controls'], stock: 1 },
  { name: 'Mild Steel Plough Cultivator', category: 'Cultivator', hourlyRate: 300, dailyRate: 2500, available: true, rating: 4.3, location: 'East Farm Machinery', description: 'Durable 5-teeth plough for soil preparation', features: ['5 Teeth Design', 'Mild Steel', 'Tractor Driven'], stock: 1 },
  { name: 'Rigid Type Cultivator', category: 'Cultivator', hourlyRate: 350, dailyRate: 2800, available: true, rating: 4.4, location: 'West Construction Equipment', description: '9-tynes rigid cultivator for intensive farming', features: ['9 Tynes', 'Rigid Design', 'High Durability'], stock: 1 },
  { name: 'Disc Harrow Cultivator', category: 'Cultivator', hourlyRate: 400, dailyRate: 3200, available: false, rating: 4.1, location: 'South Field Equipment', description: 'Disc harrow for soil breaking and leveling', features: ['Disc Design', 'Soil Breaking', 'Leveling Capability'], stock: 1 },
  { name: 'AG400 Paddy Thresher', category: 'Thresher', hourlyRate: 420, dailyRate: 3300, available: true, rating: 4.2, location: 'Central Farm Services', description: 'AG400 series paddy thresher with enhanced efficiency', features: ['AG400 Series', 'Paddy Specific', 'Enhanced Efficiency'], stock: 1 },
  { name: 'Tractor Rotavator 18 HP', category: 'Rotavator', hourlyRate: 500, dailyRate: 4000, available: true, rating: 4.5, location: 'North Valley Equipment', description: '18 HP tractor rotavator for soil cultivation', features: ['18 HP Power', 'Soil Cultivation', 'Tractor Mounted'], stock: 1 },
  { name: 'Additional Agricultural Equipment', category: 'Specialty', hourlyRate: 600, dailyRate: 4800, available: true, rating: 4.3, location: 'Central Farm Services', description: 'Specialized agricultural equipment for unique farming needs', features: ['Specialty Equipment', 'Versatile Use', 'High Efficiency'], stock: 1 },
];

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    let inserted = 0;
    for (const item of defaultMachines) {
      const existing = await Machine.findOne({ name: item.name });
      const payload = { ...item, image: tinyImage };
      if (existing) {
        // Update existing to keep details in sync
        await Machine.updateOne({ _id: existing._id }, { $set: payload });
      } else {
        await Machine.create(payload);
        inserted += 1;
      }
    }

    const total = await Machine.countDocuments();
    console.log(`✅ Seed complete. Inserted ${inserted}. Total machines in DB: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();


