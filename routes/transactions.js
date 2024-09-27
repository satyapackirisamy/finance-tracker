const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Add a new transaction
router.post('/', auth, async (req, res) => {
    const { type, amount, category, description } = req.body;
    
    try {
        const transaction = new Transaction({
            user: req.user.id,
            type,
            amount,
            category,
            description,
        });

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get all transactions
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get summary report
router.get('/report', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        const report = transactions.reduce((acc, curr) => {
            if (curr.type === 'income') acc.totalIncome += curr.amount;
            if (curr.type === 'expense') acc.totalExpense += curr.amount;
            return acc;
        }, { totalIncome: 0, totalExpense: 0 });

        res.json(report);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;

