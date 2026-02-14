const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        console.log('Seeder: Checking admin user...');
        const email = 'admin@example.com';
        const password = 'password123';
        const name = 'Admin User';

        let user = await User.findOne({ email });
        if (user) {
            console.log('Seeder: Admin already exists.');
            return;
        }

        user = new User({
            name,
            email,
            password
        });

        await user.save();
        console.log('Seeder: Admin user created successfully.');
        console.log(` Credentials -> Email: ${email}, Password: ${password}`);
    } catch (err) {
        console.error('Seeder Error:', err);
    }
};

module.exports = seedAdmin;
