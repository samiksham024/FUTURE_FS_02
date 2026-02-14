const Lead = require('../models/Lead');
const { validationResult } = require('express-validator');

// @route   GET api/leads
// @desc    Get all leads
// @access  Private
exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/leads
// @desc    Add new lead (Public usually for contact forms, but can be private for manual add)
exports.createLead = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, source, notes, status } = req.body;

    try {
        const newLead = new Lead({
            name,
            email,
            phone,
            source,
            notes,
            status: status || 'New',
            history: [{
                text: `Lead created from ${source || 'Website Form'}`,
                date: new Date()
            }]
        });

        const lead = await newLead.save();
        res.json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/leads/:id
// @desc    Update lead
// @access  Private
exports.updateLead = async (req, res) => {
    const { name, email, phone, source, status, notes } = req.body;

    try {
        let lead = await Lead.findById(req.params.id);

        if (!lead) return res.status(404).json({ msg: 'Lead not found' });

        const historyItem = [];
        const leadFields = {};

        if (name) leadFields.name = name;
        if (email) leadFields.email = email;
        if (phone) leadFields.phone = phone;
        if (source) leadFields.source = source;

        if (status && status !== lead.status) {
            leadFields.status = status;
            historyItem.push({
                text: `Status changed from ${lead.status} to ${status}`,
                date: new Date()
            });
            if (status === 'Contacted' || status === 'Converted') {
                leadFields.lastContacted = Date.now();
            }
        }

        if (notes && notes !== lead.notes) {
            leadFields.notes = notes;
            historyItem.push({
                text: `Notes updated`,
                date: new Date()
            });
        }

        // Just a generic update log if nothing specific but fields changed
        if (historyItem.length === 0 && Object.keys(leadFields).length > 0) {
            historyItem.push({
                text: `Lead details updated`,
                date: new Date()
            });
        }

        // Push history to fields to update
        // Note: For findByIdAndUpdate, we need $push for arrays if we want atomic, 
        // but here we are constructing the object.
        // The MockLead logic I wrote supports $push side-by-side with $set if passed to update.
        // But Mongoose usually wants separate operators.

        const updateQuery = { $set: leadFields };
        if (historyItem.length > 0) {
            updateQuery.$push = { history: { $each: historyItem } };
        }

        lead = await Lead.findByIdAndUpdate(
            req.params.id,
            updateQuery,
            { new: true }
        );

        res.json(lead);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE api/leads/:id
// @desc    Delete lead
// @access  Private
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) return res.status(404).json({ msg: 'Lead not found' });

        await Lead.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Lead removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
