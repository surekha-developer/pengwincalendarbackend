const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  reminderDateTime: {
    type: Date,
    required: true
  },

  emailSent: {
    type: Boolean,
    default: false
  },

  expiresAt: {
    type: Date,
    required: true
  }

}, { timestamps: true });

// 🔥 Auto-delete after expiresAt (10 days)
reminderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Reminder', reminderSchema);
