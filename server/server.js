const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Connect Database
connectDB().then(() => {
    require('./utils/seeder')();
});

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use(morgan('dev'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));

// Serve static assets in production (optional placeholder)
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    // app.use(express.static('client/dist'));
    // app.get('*', (req, res) => {
    //     res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    // });
}


if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
