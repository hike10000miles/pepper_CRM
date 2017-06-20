const express = require('express');
const Journal    = require('../models/journal');

const journalRoute = express.Router();

journalRoute.get('/', function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Journal.find({_userId: req.user._doc._id}, (err, journals) => {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again later'
                });
            } else if(journals) {
                res.status(200).json(journals);
            } else {
                res.status(404).json({
                    message: 'Journals not found!'
                });
            }
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Journal.find({_userId: req.user._doc._id}, (err, journals) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later'
            });
        }else if(journals) {
                res.status(200).json(journals);
            } else {
                res.status(404).json({
                    message: 'Journals not found!'
                });
            }
        });
    }
});

journalRoute.get('/:journalId', function (req, res) {
    Journal.findOne({
        _id: req.params.journalId, 
        _userId: req.user._doc._id
    }, function (err, journal) {
        if (err) {
            res.status(500).json({
                message: 'This is not the journal you are looking for!',
                err: err
            });
        } else {
            if(journal) {
                res.status(200).json(journal);
            } else {
                res.status(404).json({
                    message: 'This is not the journal you are looking for.'
                });
            }
        }
    })
});

journalRoute.post('/', function (req, res) {
    let journal = new Journal({
        _userId: req.user._doc._id,
        entry: req.body.entry,
        title: req.body.title
    });
    journal.save((err, journal) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later.',
                err: err
            });
        } else if (journal){
            res.status(200).json({
                message: 'New journal has been added.',
                journal: journal
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            })
        }
    });
});

journalRoute.patch('/:journalId', function(req, res) {
    Journal.findOneAndUpdate({
        _id: req.params.journalId,
        _userId: req.user._doc._id}, {
            $set: {
                entry: req.body.entry,
                title: req.body.title
            }
        },{
            runValidators: true,
            new: true
        }, function (err, journal) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if(journal) {
                res.status(200).json({
                    message: 'The details about this journal is updated',
                    journal: journal
                });
            } else {
                res.status(400).json({
                    message: 'Something went wrong... Try agin.',
                });
            }
        }
    );
});

journalRoute.delete('/:journalId', function (req, res) {
    Journal.remove({_id: req.params.journalId, _userId: req.user._doc._id}, (err) => {
        if(err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else {
            res.status(200).json({
                message: 'This journal is deleted successfully.'
            });
        }
    });
});

module.exports = journalRoute;