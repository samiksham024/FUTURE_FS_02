const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/leads.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Load leads from file
let leads = [];
try {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        leads = JSON.parse(data);
    }
} catch (err) {
    console.error('Error loading leads.json', err);
    leads = [];
}

const saveLeads = () => {
    try {
        console.log('Saving leads to:', DATA_FILE); // DEBUG
        console.log('Leads count:', leads.length); // DEBUG
        fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));
        console.log('Leads saved successfully.'); // DEBUG
    } catch (err) {
        console.error('Error saving leads.json', err);
    }
};

class MockLead {
    static calculateScore(data) {
        let score = 0;
        if (data.email) score += 20;
        if (data.phone) score += 20;
        if (data.source === 'Referral') score += 20;
        if (data.source === 'LinkedIn') score += 10;

        switch (data.status) {
            case 'Contacted': score += 15; break;
            case 'Converted': score += 40; break;
        }

        return Math.min(score, 100);
    }

    constructor(data) {
        this._id = data._id || Math.random().toString(36).substr(2, 9);
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.source = data.source || 'Website Form';
        this.status = data.status || 'New';
        this.notes = data.notes;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.lastContacted = data.lastContacted;
        this.history = data.history || [{ text: 'Lead Created', date: new Date() }];
        this.score = MockLead.calculateScore(this);
        this.isStarred = data.isStarred || false;
    }

    async save() {
        this.score = MockLead.calculateScore(this);
        leads.unshift(this);
        saveLeads();
        return this;
    }

    static find() {
        return {
            sort: (criteria) => {
                if (criteria.createdAt === -1) {
                    return [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                return leads;
            }
        }
    }

    static async findById(id) {
        const lead = leads.find(l => l._id === id);
        return lead ? new MockLead(lead) : null;
    }

    static async findByIdAndUpdate(id, update, options) {
        const index = leads.findIndex(l => l._id === id);
        if (index === -1) return null;

        const $set = update.$set || {};
        const $push = update.$push || {};

        leads[index] = { ...leads[index], ...$set };

        if ($set.status || $set.email || $set.phone || $set.source) {
            leads[index].score = MockLead.calculateScore(leads[index]);
        }

        if ($push.history) {
            if (!leads[index].history) leads[index].history = [];
            if ($push.history.$each && Array.isArray($push.history.$each)) {
                leads[index].history.push(...$push.history.$each);
            } else {
                leads[index].history.push($push.history);
            }
        }

        saveLeads();
        return leads[index];
    }

    static async deleteOne({ _id }) {
        const index = leads.findIndex(l => String(l._id) === String(_id));
        if (index !== -1) {
            leads.splice(index, 1);
            saveLeads();
            return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
    }
}

const mongoose = require('mongoose');
const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    source: { type: String, default: 'Website Form' },
    status: { type: String, enum: ['New', 'Contacted', 'Converted', 'Lost'], default: 'New' },
    notes: { type: String },
    score: { type: Number, default: 0 },
    isStarred: { type: Boolean, default: false },
    history: [{
        text: String,
        date: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    lastContacted: { type: Date }
});

LeadSchema.pre('save', function (next) {
    let score = 0;
    if (this.email) score += 20;
    if (this.phone) score += 20;
    if (this.source === 'Referral') score += 20;
    if (this.source === 'LinkedIn') score += 10;

    switch (this.status) {
        case 'Contacted': score += 15; break;
        case 'Converted': score += 40; break;
    }
    this.score = Math.min(score, 100);
    next();
});

const MongooseLead = mongoose.model('Lead', LeadSchema);

module.exports = new Proxy(MongooseLead, {
    get: function (target, prop, receiver) {
        if (global.hasMongoDB === false) {
            if (prop === 'find') return MockLead.find;
            if (prop === 'findById') return MockLead.findById;
            if (prop === 'findByIdAndUpdate') return MockLead.findByIdAndUpdate;
            if (prop === 'deleteOne') return MockLead.deleteOne;
        }
        return Reflect.get(target, prop, receiver);
    },
    construct: function (target, args) {
        if (global.hasMongoDB === false) {
            return new MockLead(...args);
        }
        return new target(...args);
    }
});
