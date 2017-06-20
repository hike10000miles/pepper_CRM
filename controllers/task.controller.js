const express = require('express');
const Task    = require('../models/task');

const taskRoute = express.Router();

taskRoute.get('/', function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Task.find({_userId: req.user._doc._id, _contactId: req.contact._id}, (err, tasks) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later'
            });
        }
        res.status(200).json(tasks);
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Task.find({_userId: req.user._doc._id, _contactId: req.contact._id}, (err, tasks) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later'
            });
        }
        res.status(200).json(tasks);
        });
    }
});

taskRoute.get('/:taskId', function (req, res) {
    Task.findOne({
        _id: req.params.taskId, 
        _userId: req.user._doc._id,
        _contactId: req.contact._id
    }, function (err, task) {
        if (err) {
            res.status(404).json({
                message: 'This is not the task you are looking for!',
                err: err
            });
        } else {
            if(task) {
                res.status(200).json(task);
            } else {
                res.status(404).json({
                    message: 'This is not the task you are looking for!'
                });
            }
        }
    })
});

taskRoute.post('/', function (req, res) {
    let task = new Task({
        _contactId: req.contact._id,
        _userId: req.user._doc._id,
        contactName: req.contact.details.firstName,
        task: req.body.task,
        comment: req.body.comment,
        done: false
    });
    task.save((err, task) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later.',
                err: err
            });
        } else if (task) {
            res.status(200).json({
                message: 'New task has been added into the data base!',
                success: true,
                task: task
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            });
        }
    });
});

taskRoute.patch('/:taskId', function(req, res) {
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _contactId: req.contact._id}, {
            $set: {
                comment: req.body.comment,
                task: req.body.task
            }
        },{
            runValidators: true,
            new: true
        }, function (err, task) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if(task) {
                res.status(200).json({
                    message: "Task for " + req.contact.details.firstName + " has been updated successfule.",
                    success: true,
                    task: task
                });
            } else {
                res.status(400).json({
                    message: "Something went wrong. Try again"
                });
            }
        }
    );
});

taskRoute.patch('/:taskId/done', function (req, res) {
    Task.update({
        _id: req.params.taskId,
        _contactId: req.contact._id}, {
            $set: {
                done: true
            }
        }, function (err, raw) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if(raw.n && raw.ok) {
                res.status(200).json({
                    message: "Task for " + req.contact.details.firstName + " has been updated to done",
                    success: true
                });
            }
        }
    );
});

taskRoute.delete('/:taskId', function (req, res) {
    Task.remove({_id: req.params.taskId, _contactId: req.contact._id}, (err) => {
        if(err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else {
            res.status(200).json({
                message: 'Task deleted successfully.'
            });
        }
    });
});

module.exports = taskRoute;