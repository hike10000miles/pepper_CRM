const express = require('express');
const User = require('../models/user');
const bcrpt = require('bcrypt-nodejs');
const Contact = require('../models/contact');
const Task = require('../models/task');
const Debt = require('../models/debt');
const Reminder = require('../models/reminder');

const usersRoute = express.Router();

function newPassword(req, res, next) {
    bcrpt.genSalt(5, (err, salt) => {
        if (err) {
            res.status(500).json({
                err: err,
                message: 'Server error. Try again.'
            });
        }

        bcrpt.hash(req.body.password, salt, null, (err, hash) => {
            if (err) {
                res.status(500).json({
                    err: err,
                    message: 'Server error. Try again.'
                });
            }
            req.password = hash;
            next();
        });
    });
    
}

usersRoute.get('/:userId', function (req, res) {
    User.findById(req.params.userId, (err, user) => {
        if (err) {
            res.status(500).json({
                message: 'Server error! Please make sure you have entered the correct id and try again.',
                err: err
            });
        } else if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                message: 'This is not the user you are looking for!'
            });
        }
    });
});

usersRoute.put('/:userId', newPassword, (req, res) => {
    User.findOneAndUpdate({
        _id: req.params.userId
    }, {
        $set:{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.password
        }
    }, {
        runValidators: true,
        new: true
    }, function (err, user) {
        if (err) {
            res.status(500).json({
                err: err,
                message: 'Server error, try again.'
            });
        } else if (user) {
            res.status(200).json({
                message: 'Your profile have been updated.',
                success: true,
                redirect_url: '/login',
                user: user
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.',
            });
        }
    });
});

usersRoute.delete('/:userId', function(req, res) {
    User.remove({_id: req.params.userId}, function (err) {
        if(err) {
            res.status(500).json({
                message: 'Server error, try again later.'
            });
        } else {
            Contact.remove({_userId: req.user._doc._id}, function (err) {
                if(err) {
                    res.status(500).json({
                        message: 'Server error, try again later.'
                    });
                } else {
                    Task.remove({_userId: req.user._doc._id},  function (err) {
                        if(err) {
                            res.status(500).json({
                                message: 'Server error, try again later.'
                            });
                        } else {
                            Debt.remove({_userId: req.user._doc._id},  function (err) {
                                if(err) {
                                    res.status(500).json({
                                        message: 'Server error, try again later.'
                                    });
                                } else {
                                    Reminder.remove({_userId: req.user._doc._id},  function (err) {
                                        if(err) {
                                            res.status(500).json({
                                                message: 'Server error, try again later.'
                                            });
                                        } else {
                                            res.status(200).json({
                                                message: "User's profile deleted, see you later."
                                            })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = usersRoute;