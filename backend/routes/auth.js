import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = Router();

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

export default router;


