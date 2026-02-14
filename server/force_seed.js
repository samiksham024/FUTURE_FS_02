const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const forceSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Force Seed...');

        // Clear existing users to avoid duplicates/confusion
        await User.deleteMany({});
        console.log('Cleared existing users');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const user = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123' // The pre-save hook will hash this, but wait.
            // If I use new User() and save(), the pre-save hook in User.js handles hashing.
            // Let's rely on the model.
        });

        // The model has this:
        // UserSchema.pre('save', async function(next) {
        //    if (!this.isModified('password')) { return next(); }
        //    const salt = await bcrypt.genSalt(10);
        //    this.password = await bcrypt.hash(this.password, salt);
        //    next();
        // });

        await user.save();
        console.log('Admin user CREATED SUCCESSFULLY.');
        console.log('Email: admin@example.com');
        console.log('Password: password123');

        process.exit(0);
    } catch (err) {
        console.error('Force Seed Error:', err);
        process.exit(1);
    }
};

forceSeed();
