# 🚀 Quick Setup Guide - Rent-a-Cultivator

## ✅ Current Status
Your MongoDB Atlas connection is already configured and working!

**Connection String:** `mongodb+srv://Ranjith_76:RanjithB_76@cluster0.z8wkr5v.mongodb.net/`

## 🚀 Start Your Application

### 1. Start the Backend Server
```bash
npm start
```

**Expected Output:**
```
✅ Loaded MongoDB connection from config.env
MongoDB URI: mongodb+srv://Ranjith_76:RanjithB_76@cluster0.z8wkr5v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
Connected to MongoDB
Server running on http://localhost:3000
```

### 2. Start the Frontend (in a new terminal)
```bash
npm run dev
```

## 🧪 Test Your System

### Test 1: Check Server Health
Open: `http://localhost:3000/health`
Should show: `{"status":"ok","dbConnected":true}`

### Test 2: Test Database Connection
Open: `http://localhost:3000/test-db`
Should show successful connection message

### Test 3: Test Complete Booking System
```bash
node test-booking-system.js
```

## 🎯 Test the Frontend

1. Open your frontend (usually `http://localhost:5173`)
2. Navigate to the equipment showcase
3. Try booking a machine
4. Check if the booking is stored in your MongoDB Atlas database

## 🔍 Troubleshooting

### If server won't start:
- Check if port 3000 is available
- Verify your MongoDB Atlas cluster is running
- Check the connection string in `config.env`

### If bookings aren't saving:
- Check server logs for error messages
- Verify database connection with health endpoint
- Check browser console for frontend errors

### If database connection fails:
- Verify your Atlas cluster is active
- Check if your IP is whitelisted in Atlas
- Verify username/password in connection string

## 📊 Verify Database

Your bookings will be stored in MongoDB Atlas in the `rent-a-cultivator` database with these collections:
- `users` - User accounts
- `machines` - Equipment inventory  
- `bookings` - Equipment rental bookings

## 🎉 You're All Set!

Your booking system is now configured with MongoDB Atlas and should work perfectly. All booking details will be stored in your cloud database.
