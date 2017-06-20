const express = require('express');
const Gift    = require('../models/gift');

const giftRoute = express.Router();

giftRoute.get('/', function (req, res) {
    let limit;
    let page;
    if(req.query.limit && req.query.page) {
        limit = +req.query.limit;
        page = +req.query.page;
    }
    if(limit && page) {
        Gift.find({_contactId: req.contact._id}, (err, gifts) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later'
            });
        }
        res.status(200).json(gifts);
        }).skip((page - 1) * limit).limit(limit);
    } else {
    Gift.find({_contactId: req.contact._id}, (err, gifts) => {
    if (err) {
        res.status(500).json({
            message: 'Server error, try again later'
        });
    }
    res.status(200).json(gifts);
    });
    }
});

giftRoute.get('/:giftId', function (req, res) {
    Gift.findOne({
        _id: req.params.giftId, 
        _contactId: req.contact._id
    }, function (err, gift) {
        if (err) {
            res.status(404).json({
                message: 'This is not the gift you are looking for!',
                err: err
            });
        } else {
            if (gift) {
                res.status(200).json(gift);
            } else {
                res.status(404).json({
                    message: 'This is not the gift you are looking for!'
                });
            }
        }
    })
});

giftRoute.post('/', function (req, res) {
    let gift = new Gift({
        _contactId: req.contact._id,
        status: req.body.status,
        description: req.body.description,
        link: req.body.link,
        value: req.body.value,
        comment: req.body.comment,
        forFamily: req.body.forFamily,
        familyReciver: req.body.familyReciver
    });
    gift.save((err, gift) => {
        if (err) {
            res.status(500).json({
                message: 'Server error, try again later.',
                err: err
            });
        } else if (gift) {
            res.status(200).json({
                message: 'New gift has been added to ' + req.contact.details.firstName + '\'s details.',
                success: true,
                gift: gift
            });
        } else {
            res.status(400).json({
                message: 'Something went wrong. Try again.'
            })
        }
    });
});

giftRoute.patch('/:giftId', function(req, res) {
    Gift.findOneAndUpdate({
        _id: req.params.giftId,
        _contactId: req.contact._id}, {
            $set: {
                description: req.body.description,
                link: req.body.link,
                value: req.body.value,
                comment: req.body.comment,
                forFamily: req.body.forFamily,
                familyReciver: req.body.familyReciver
            }
        },{
            runValidators: true,
            new: true
        }, function (err, gift) {
            if (err) {
                res.status(500).json({
                    message: 'Server error, try again.',
                    err: err
                });
            } else if(gift) {
                res.status(200).json({
                    message: 'The details about this gift is updated',
                    success: true,
                    gift: gift
                });
            } else {
                res.status(400).json({
                    message: 'Something went wrong. Try again.'
                });
            }
        }
    );
});

giftRoute.delete('/:giftId', function (req, res) {
    Gift.remove({_id: req.params.giftId, _contactId: req.contact._id}, (err) => {
        if(err) {
            res.status(500).json({
                message: 'Server error, try again.',
                err: err
            });
        } else {
            res.status(200).json({
                message: 'This gift is deleted successfully.'
            });
        }
    });
});

module.exports = giftRoute;