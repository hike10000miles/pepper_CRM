const express = require('express');
const Note    = require('../models/note');

const noteRoute = express.Router();

noteRoute.get('/', function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Note.find({_userId: req.user._id}, (err, notes) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later'
            });
        }
        res.status(200).json(notes);
        }).skip((page - 1) * limit).limit(limit);
    } else {
        Note.find({_userIf: req.user._id}, (err, notes) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later'
            });
        }

        res.status(200).json(notes);
        });
    }
});

noteRoute.get('/:noteId', function (req, res) {
    Note.findOne({
        _id: req.params.noteId
    }, function (err, note) {
        if (err) {
            res.status(500).json({
                message: 'This is not the note you are looking for!',
                err: err
            });
        } else {
            if(note) {
                res.status(200).json(note);
            } else {
                res.status(404).json({
                    message: 'This is not the note you are looking for.'
                });
            }
        }
    })
});

noteRoute.post('/', function (req, res) {
    let note = new Note({
        _contactId: req.contact._id,
        note: req.body.note
    });
    note.save((err, note) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later.',
                err: err
            });
        } else if (note){
            res.status(200).json({
                message: 'New note has been added.',
                note: note,
                success: true
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            });
        }
    });
});

noteRoute.patch('/:noteId', function(req, res) {
    Note.findOneAndUpdate({
        _id: req.params.noteId,
        _contactId: req.contact._id
    }, {
        $set: {
            note: req.body.note
            }
        },{
            runValidators: true,
            new: true
        }, function (err, note) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if(note) {
                res.status(200).json({
                    message: 'The details about this note is updated',
                    success: true,
                    note: note
                });
            } else {
                res.status(400).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        }
    );
});

noteRoute.delete('/:noteId', function (req, res) {
    Note.remove({_id: req.params.noteId, _contactId: req.contact._id}, (err) => {
        if(err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else {
            res.status(200).json({
                message: 'This note is deleted successfully.'
            });
        }
    });
});

module.exports = noteRoute;