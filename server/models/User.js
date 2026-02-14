const bcrypt = require('bcryptjs');

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    try {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    } catch (err) { console.error(err); }
}

// Load users from file
let users = [];
try {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        users = JSON.parse(data);
    }
} catch (err) {
    console.error('Error loading users.json', err);
    users = [];
}

const saveUsers = () => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error saving users.json', err);
    }
};

class MockUser {
    constructor(data) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.date = new Date();
    }

    async save() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        // Update if exists or push new
        const existingIndex = users.findIndex(u => u.email === this.email);
        if (existingIndex !== -1) {
            users[existingIndex] = this;
        } else {
            users.push(this);
        }

        saveUsers();
        return this;
    }

    static async findOne({ email }) {
        const user = users.find(u => u.email === email);
        if (!user) return null;
        return MockUser.hydrate(user);
    }

    static async findById(id) {
        const user = users.find(u => u.id === id);
        return user ? MockUser.hydrate(user) : null;
    }

    static hydrate(userLink) {
        return {
            ...userLink,
            matchPassword: async function (entered) {
                return await bcrypt.compare(entered, userLink.password);
            },
            save: async function () {
                // Mock save update for existing user
                const index = users.findIndex(u => u.email === userLink.email);
                if (index !== -1) {
                    // Check if password was modified (naive check: if it looks like a hash)
                    // In a real app we'd track "modified" paths. 
                    // Here we just save back what we have.
                    // If user changed password, they should have hashed it before calling save in controller?
                    // Actually, controller does: user.password = newHash; user.save();

                    // We need to merge properties
                    users[index] = { ...users[index], ...this };
                    // But 'this' object here is the hydrated one with methods.
                    // We should only store data properties.
                    const dataOnly = { ...this };
                    delete dataOnly.matchPassword;
                    delete dataOnly.save;
                    delete dataOnly.select;

                    users[index] = dataOnly;
                    saveUsers();
                }
                return this;
            },
            select: function () { return this; }
        };
    }

    static async seed(data) {
        // Direct seed without double hashing if already hashed? 
        // Seeder passes raw password, so existing save() logic is fine.
        const u = new MockUser(data);
        await u.save();
    }
}

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUser = mongoose.model('User', UserSchema);

// Dynamic Export
module.exports = new Proxy(MongooseUser, {
    get: function (target, prop, receiver) {
        if (global.hasMongoDB === false) {
            // Redirect static methods
            if (prop === 'findOne') return MockUser.findOne;
            if (prop === 'findById') return MockUser.findById;
        }
        return Reflect.get(target, prop, receiver);
    },
    construct: function (target, args) {
        if (global.hasMongoDB === false) {
            return new MockUser(...args);
        }
        return new target(...args);
    }
});
