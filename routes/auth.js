const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');



router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // 🔹 1. BASIC VALIDATION (ADD HERE)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // 1.1 Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters'
        });
    }

    try {
        // 🔹 2. CHECK EXISTING USER
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 🔹 3. HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 4. CREATE USER
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // 🔹 5. RESPONSE
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 🔹 1. BASIC VALIDATION
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // 1.1 Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // 1.2 Password length validation
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
        // 🔹 2. CHECK IF USER EXISTS
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 🔹 3. CHECK PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // 🔹 4. GENERATE JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // you can also make it '7d' like signup
        );

        // 🔹 5. SUCCESS RESPONSE
        res.status(200).json({ 
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, email: user.email } 
        });

    } catch(err) {
    console.log(err); // Log the real error in terminal
    res.status(500).json({ message: err.message });
}
});

// Get current logged-in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

