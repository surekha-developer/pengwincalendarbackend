const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// const sendReminderEmail = async (to, title, dateTime) => {
//   try {
//    await transporter.sendMail({
//   from: `"Pengwin Calendar" <${process.env.EMAIL_USER}>`,
//   to,
//   subject: `⏰ Reminder: ${title}`,
//   html: `
//     <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; background: #f9f9f9;">
//       <h2 style="color: #1f2937;">⏰ Pengwin Calendar Reminder</h2>
//       <p style="font-size: 16px;">Hi <b>${to.split('@')[0]}</b>,</p>
//       <p style="font-size: 16px;">This is a friendly reminder for your upcoming task:</p>
//       <p style="font-size: 18px; font-weight: bold; margin: 10px 0;">${title}</p>
//       <p style="font-size: 16px;">Scheduled for: <b>${new Date(dateTime).toLocaleString()}</b></p>
//       <hr style="margin: 20px 0;" />
//       <p style="font-size: 14px; color: #555;">You will see this reminder in your Pengwin Calendar dashboard too. Stay productive! 🚀</p>
//     </div>
//   `
// });

//     console.log(`✅ Reminder email sent to ${to}`);
//   } catch (error) {
//     console.error(`❌ Failed to send email to ${to}`, error.message);
//     throw error; // important for retry logic later
//   }
// };

const sendReminderEmail = async (to, title, dateTime) => {
  try {
    const formattedTime = new Date(dateTime).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    await transporter.sendMail({
      from: `"Pengwin Calendar" <${process.env.EMAIL_USER}>`,
      to,
      subject: `⏰ Reminder: ${title}`,
      text: `Hi ${to.split('@')[0]},\n\nThis is your reminder for: ${title}\nScheduled for: ${formattedTime}\n\nCheck your Pengwin Calendar dashboard for details.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; background: #f9f9f9;">
          <h2 style="color: #1f2937;">⏰ Pengwin Calendar Reminder</h2>
          <p style="font-size: 16px;">Hi <b>${to.split('@')[0]}</b>,</p>
          <p style="font-size: 16px;">This is a friendly reminder for your upcoming task:</p>
          <p style="font-size: 18px; font-weight: bold; margin: 10px 0;">${title}</p>
          <p style="font-size: 16px;">Scheduled for: <b>${formattedTime}</b></p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 14px; color: #555;">You will see this reminder in your Pengwin Calendar dashboard too. Stay productive! 🚀</p>
        </div>
      `
    });

    console.log(`✅ Reminder email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}`, error.message);
    throw error;
  }
};






module.exports = sendReminderEmail;
