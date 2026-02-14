const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const leadController = require('../controllers/leadController');

// @route   GET api/leads
// @desc    Get all leads
// @access  Private
router.get('/', auth, leadController.getLeads);

// @route   POST api/leads
// @desc    Add new lead
// @access  Public
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail()
    ],
    leadController.createLead
);

// @route   PUT api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', auth, leadController.updateLead);

// @route   DELETE api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete('/:id', auth, leadController.deleteLead);

module.exports = router;
