// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', require('./routes/auth'));

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/reminders', require('./routes/reminder'));


// // Connect MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(err));

// // Start background job for reminders
// require('./jobs/reminderJob');

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//.........

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
// app.use(cors({
//   origin: '*', // change to Netlify URL later if needed
// }));

app.use(cors({
  origin: [
    'https://pengwintechcalendar.netlify.app', // replace with your frontend URL
    'http://localhost:3000',              // for local dev
  ],
  credentials: true, // allow cookies if your auth uses them
}));
app.use(express.json());

/* ---------- HEALTH / ROOT ROUTE ---------- */
app.get('/', (req, res) => {
  res.status(200).send('Backend is running 🚀');
});

/* ---------- ROUTES ---------- */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reminders', require('./routes/reminder'));

/* ---------- DATABASE CONNECTION ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/* ---------- BACKGROUND JOB ---------- */
require('./jobs/reminderJob');

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
