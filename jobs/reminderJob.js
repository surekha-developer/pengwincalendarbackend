


const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const sendEmail = require('../utils/emailService');
const User = require('../models/User');

cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();

        const reminders = await Reminder.find({
            reminderDateTime: { $lte: now },
            emailSent: false
        }).populate('userId');

        for (let reminder of reminders) {
            await sendEmail(reminder.userId.email, reminder.title);
            reminder.emailSent = true;
            await reminder.save();
        }
    } catch (error) {
        console.error('Reminder job error:', error);
    }
});
