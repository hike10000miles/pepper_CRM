const express = require('express');
const Activity    = require('../models/activity');

const activityRoute = express.Router();

activityRoute.get('/', function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Activity.find({_contactId: req.contact._id}, (err, activities) => {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again later'
                });
            }
            res.status(200).json(activities);
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Activity.find({_contactId: req.contact._id}, (err, activities) => {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again later'
                });
            }
            res.status(200).json(activities);
        });
    }
});

activityRoute.get('/:activityId', function (req, res) {
    Activity.findOne({
        _id: req.params.activityId, 
        _contactId: req.contact._id
    }, function (err, activity) {
        if (err) {
            res.status(500).json({
                message: 'This is not the activity you are looking for!',
                err: err
            });
        } else {
            if (activity) {
                res.status(200).json(activity);
            } else {
                res.status(404).json({
                    message: "This is not the activity you are looking for!"
                });
            }
        }
    })
});

activityRoute.post('/', function (req, res) {
    let date;
    if(req.body.date){
        date = new Date(req.body.date);
    }
    let activity = new Activity({
        _contactId: req.contact._id,
        description: req.body.description,
        date: date,
        categorize: req.body.categorize,
        comment: req.body.comment
    });
    activity.save((err, activity) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later.',
                err: err
            });
        } else if(activity){
            res.status(200).json({
                message: 'New activity has been added into the data base!',
                activity: activity
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            });
        }
    });
});

activityRoute.patch('/:activityId', function(req, res) {
    let date;
    if(req.body.date){
        date = new Date(req.body.date);
    }
    Activity.findOneAndUpdate({
        _id: req.params.activityId,
        _contactId: req.contact._id}, {
            $set: {
                description: req.body.comment,
                date: date,
                categorize: req.body.categorize,
                comment: req.body.comment
            }
        },{
            runValidators: true,
            new: true
        },function (err, activity) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if(activity) {
                res.status(200).json({
                    message: "Activity with " + req.contact.details.firstName + " has been updated successfule.",
                    success: true,
                    activity: activity
                });
            } else {
                res.status(400).json({
                    message: 'Something went wrong. Try again'
                });
            }
        }
    );
});

activityRoute.delete('/:activityId', function (req, res) {
    Activity.remove({_id: req.params.activityId, _contactId: req.contact._id}, (err) => {
        if(err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else {
            res.status(200).json({
                message: 'Activity deleted successfully.'
            });
        }
    });
});

module.exports = activityRoute;