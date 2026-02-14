const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB options connected for seeding...');

        const email = 'admin@example.com';
        const password = 'password123';
        const name = 'Admin User';

        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists');
            process.exit(0);
        }

        user = new User({
            name,
            email,
            password
        });

        await user.save();
        console.log(`Admin user created: ${email} / ${password}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUser();
