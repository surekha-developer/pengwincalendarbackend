const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',  // or any SMTP service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Reminder: ${subject}`,
    text: `This is your reminder for: ${subject}`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
