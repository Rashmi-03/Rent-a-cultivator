import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Machine from '../models/machine.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, passwordHash, role: role === 'admin' ? 'admin' : 'user' });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update admin email/password with current password verification
router.put('/admin/update-credentials', async (req, res) => {
  try {
    const { email, currentPassword, newEmail, newPassword } = req.body;
    if (!email || !currentPassword || (!newEmail && !newPassword)) {
      return res.status(400).json({ message: 'Provide email, currentPassword, and at least one of newEmail or newPassword' });
    }

    const adminUser = await User.findOne({ email, role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const valid = await bcrypt.compare(currentPassword, adminUser.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    if (newEmail && newEmail !== adminUser.email) {
      const emailTaken = await User.findOne({ email: newEmail });
      if (emailTaken) {
        return res.status(409).json({ message: 'New email already in use' });
      }
      adminUser.email = newEmail.toLowerCase().trim();
    }

    if (newPassword) {
      adminUser.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await adminUser.save();

    return res.json({
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      phone: adminUser.phone,
      role: adminUser.role,
      updatedAt: adminUser.updatedAt,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Booking routes
router.post('/bookings', async (req, res) => {
  try {
    const {
      equipmentId,
      equipmentName,
      startDate,
      endDate,
      duration,
      durationType,
      distance,
      basePrice,
      distancePrice,
      totalPrice,
      deliveryAddress,
      contactNumber,
      specialRequirements,
      userId
    } = req.body;

    const newBooking = new Booking({
      user: userId,
      machine: equipmentId,
      quantity: 1,
      status: 'pending',
      startDate,
      endDate,
      duration,
      durationType,
      distance,
      basePrice,
      distancePrice,
      totalPrice,
      deliveryAddress,
      contactNumber,
      specialRequirements,
      equipmentId,
      equipmentName
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

router.get('/bookings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let query = {};
    
    // Check if userId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(userId)) {
      query.user = userId;
    } else {
      // For demo purposes, return all bookings if using a demo ID
      console.log('Using demo user ID, returning all bookings');
    }
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

router.put('/bookings/:bookingId/status', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

router.delete('/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
});

// Machine management routes
router.post('/machines', async (req, res) => {
  try {
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

    if (!name || !category || !image || !hourlyRate || !dailyRate || !location || !description) {
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

router.get('/machines', async (req, res) => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });
    res.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({ message: 'Failed to fetch machines' });
  }
});

router.get('/machines/:id', async (req, res) => {
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

router.put('/machines/:id', async (req, res) => {
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

router.delete('/machines/:id', async (req, res) => {
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

export default router;


