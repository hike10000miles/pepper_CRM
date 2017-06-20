const express = require('express');
const Child    = require('../models/child');

const childRoute = express.Router();

childRoute.get('/', function (req, res) {
    Child.find({_contactId: req.contact._id}, (err, children) => {
    if (err) {
        res.status(500).json({
            message: 'Server error, try again later'
        });
    }
    res.status(200).json(children);
    });
});

childRoute.get('/:childId', function (req, res) {
    Child.findOne({
        _id: req.params.childId, 
        _contactId: req.contact._id
    }, function (err, child) {
        if (err) {
            res.status(500).json({
                message: 'This is not the child you are looking for!',
                err: err
            });
        } else {
            if (child) {
                res.status(200).json(child);
            } else {
                res.status(404).json({
                    message: 'This is not the child you are looking for!'
                });
            }
        }
    })
});

childRoute.post('/', function (req, res) {
    let date;
    if(req.body.birthday) {
        date = new Date(req.body.birthday);
    }
    let child = new Child({
        _contactId: req.contact._id,
        fistName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        birthday: date,
        gender: req.body.gender
    });
    child.save((err, child) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later.',
                err: err
            });
        } else if (child) {
            res.status(200).json({
                message: 'New child has been added to ' + req.contact.details.firstName + '\'s family.',
                success: true,
                child: child
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            });
        }
    });
});

childRoute.patch('/:childId', function(req, res) {
    let date;
    if(req.body.birthday) {
        date = new Date(req.body.birthday);
    }
    Child.findOneAndUpdate({
        _id: req.params.childId,
        _contactId: req.contact._id}, {
            $set: {
                fistName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                birthday: date,
                gender: req.body.gender
            }
        },{
            runValidators: true,
            new: true
        }, function (err, child) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if(child) {
                res.status(200).json({
                    message: req.contact.details.firstName + "'s child details has been updated.",
                    success: true,
                    child: child
                });
            } else {
                res.status(400).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        }
    );
});

childRoute.delete('/:childId', function (req, res) {
    Child.remove({_id: req.params.childId, _contactId: req.contact._id}, (err) => {
        if(err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else {
            res.status(200).json({
                message: 'child details deleted successfully.'
            });
        }
    });
});

module.exports = childRoute;