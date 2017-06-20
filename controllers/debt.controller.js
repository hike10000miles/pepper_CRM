const express = require('express');
const Debt    = require('../models/debt');

const debtRoute = express.Router();

debtRoute.get('/', function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Debt.find({_contactId: req.contact._id}, (err, debts) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later'
            });
        }
        res.status(200).json(debts);
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Debt.find({_contactId: req.contact._id}, (err, debts) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later'
            });
        }
        res.status(200).json(debts);
        });
    }
});

debtRoute.get('/:debtId', function (req, res) {
    Debt.findOne({
        _id: req.params.debtId, 
        _contactId: req.contact._id
    }, function (err, debt) {
        if (err) {
            res.status(500).json({
                message: 'This is not the debt you are looking for!',
                err: err
            });
        } else {
            if(debt) {
                res.status(200).json(debt);
            } else {
                res.status(404).json({
                    message: 'This is not the debt you are looking for.'
                });
            }
        }
    })
});

debtRoute.post('/', function (req, res) {
    let amount = +req.body.amount;
    let debt = new Debt({
        _contactId: req.contact._id,
        _userId: req.user._doc._id,
        contactName: req.contact.details.firstName,
        owner: req.body.owner,
        amount: amount,
        paid: false
    });
    debt.save((err, debt) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later.',
                err: err
            });
        } else if (debt) {
            res.status(200).json({
                message: 'New debt has been added to ' + req.contact.details.firstName + '\'s book.',
                debt: debt
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            });
        }
    });
});

debtRoute.patch('/:debtId', function(req, res) {
    Debt.findOneAndUpdate({
        _id: req.params.debtId,
        _contactId: req.contact._id}, {
            $set: {
                owner: req.body.owner,
                amount: req.body.amount,
            }
        },{
            runValidators: true,
            new: true
        }, function (err, debt) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if (debt) {
                res.status(200).json({
                    message: req.contact.details.firstName + "'s debt is updated.",
                    success: true,
                    debt: debt
                });
            } else {
                res.status(400).json({
                    message: 'Something went wrong. Try Again.'
                });
            }
        }
    );
});


debtRoute.patch('/:debtId/paid', function(req, res) {
    Debt.update({
        _id: req.params.debtId,
        _contactId: req.contact._id}, {
            $set: {
                paid: true
            }
        }, function (err, raw) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if(raw.n && raw.ok) {
                res.status(200).json({
                    message: req.contact.details.firstName + "'s debt is clear.",
                    success: true
                });
            }
        }
    );
});

debtRoute.delete('/:debtId', function (req, res) {
    Debt.remove({_id: req.params.debtId, _contactId: req.contact._id}, (err) => {
        if(err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else {
            res.status(200).json({
                message: 'This Debt is deleted successfully.'
            });
        }
    });
});

module.exports = debtRoute;