

const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const authMiddleware = require('../middleware/authMiddleware');

// Create reminder
router.post('/', authMiddleware, async (req, res) => {
  const { title, reminderDateTime } = req.body;

  if (!title || !reminderDateTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // ✅ Convert to Date object and check if it's in the future
  const reminderDate = new Date(reminderDateTime);
  const now = new Date();
  if (reminderDate <= now) {
    return res.status(400).json({ message: 'Reminder time must be in the future' });
  }

  try {
    // Set expiresAt 10 days after the reminder time
    const expiresAt = new Date(reminderDate.getTime());
    expiresAt.setDate(expiresAt.getDate() + 10);

    const reminder = new Reminder({
      userId: req.user.id,
      title,
      reminderDateTime: reminderDate,
      expiresAt
    });

    await reminder.save();
    res.status(201).json(reminder);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user reminders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ reminderDateTime: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
