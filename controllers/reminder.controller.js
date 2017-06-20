const express = require('express');
const Reminder    = require('../models/reminder');

const reminderRoute = express.Router();

reminderRoute.get('/', function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Reminder.find({_userId: req.user._doc._id}, (err, reminders) => {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again later'
                });
            } else if(reminders) {
                res.status(200).json(reminders);
            } else {
                res.status(403).json({
                    message: 'Something went wrong. Try again later.'
                });
            }
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Reminder.find({_userId: req.user._doc._id}, (err, reminders) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later'
            });
        }  else if(reminders) {
                res.status(200).json(reminders);
            } else {
                res.status(403).json({
                    message: 'Something went wrong. Try again later.'
                });
            }
        });
    }
});

reminderRoute.get('/:reminderId', function (req, res) {
    Reminder.findOne({
        _id: req.params.reminderId, 
        _userIf: req.user._id
    }, function (err, reminder) {
        if (err) {
            res.status(500).json({
                message: 'This is not the reminder you are looking for!',
                err: err
            });
        } else {
            if(reminder) {
                res.status(200).json(reminder);
            } else {
                res.status(404).json({
                    message: 'This is not the reminder you are looking for.'
                });
            }
        }
    })
});

reminderRoute.post('/', function (req, res) {
    let date;
    if(req.body.date) {
        date = new Date(req.body.date);
    }
    let reminder = new Reminder({
        _userId: req.user._doc._id,
        _contactId: req.contact._id,
        description: req.body.description,
        comment: req.body.comment,
        date: date,
        frequency: {
            number: req.body.number,
            unit: req.body.unit
        }
    });
    reminder.save((err, reminder) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later.',
                err: err
            });
        } else if (reminder){
            res.status(200).json({
                message: 'New reminder has been added.',
                reminder: reminder,
                success: true
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            });
        }
    });
});

reminderRoute.patch('/:reminderId', function(req, res) {
    let date;
    if(req.body.date) {
        date = new Date(req.body.date);
    }
    Reminder.findOneAndUpdate({
        _id: req.params.reminderId,
        _contactId: req.contact._id
    }, {
        $set: {
            description: req.body.description,
            comment: req.body.comment,
            date: date,
            frequency: {
                    number: req.body.number,
                    unit: req.body.unit
                }
            }
        },{
            runValidators: true,
            new: true
        }, function (err, reminder) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if(reminder) {
                res.status(200).json({
                    message: 'The details about this reminder is updated',
                    success: true,
                    reminder: reminder
                });
            } else {
                res.status(400).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        }
    );
});

reminderRoute.delete('/:reminderId', function (req, res) {
    Reminder.remove({_id: req.params.reminderId, _contactId: req.contact._id}, (err) => {
        if(err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else {
            res.status(200).json({
                message: 'This reminder is deleted successfully.'
            });
        }
    });
});

module.exports = reminderRoute;