const express = require('express');
const User = require('../models/user');
const jwt    = require('jsonwebtoken');

function authUserAndGiveToken(req, res) {
    let token;
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if(err) {
            res.status(500).json(err);
        }
        if(!user) {
            res.json({
                success: false, 
                message: 'Authentication failed. User not found.'
            });
        } else {
            user.verifypassword(req.body.password, function (err, isMatch) {
                if (err) { 
                    res.status(500).json({
                        message: "Internal server error."
                    });
                }

                //Password did not match
                if (!isMatch) { 
                    res.status(200).json({
                        success: false,
                        message: 'Incorrect password!'
                    });
                } else {
                //Password is match, send back a token.
                    token = jwt.sign(user, req.tokenKey, {
                        expiresIn: 86400
                    });
                    res.status(200).json({
                        success: true,
                        message: 'Enjoy your token',
                        token: token,
                        redirectURL: '/dashboard',
                        userId: user._id
                    });
                }
            });
        }
    });
}

function verifyToken(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, req.tokenKey, function (err, decoded) {
            if (err) {
                res.status(401).json({
                    success: false,
                    message: 'Failed to authenticate.'
                });
            } else {
                req.user = decoded;
                User.findById(req.user._doc._id, function (err, user) {
                    if (err) {
                        res.status(500).json({
                            message: 'Something went wrong. Try again.'
                        });
                    } else if (user) {
                        next();
                    } else {
                        res.status(404).json({
                            message: "User not found",
                        });
                    }
                });
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}

module.exports.authUser = authUserAndGiveToken;
module.exports.verifyToken = verifyToken;