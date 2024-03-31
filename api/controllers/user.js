const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_signup = (req, res, next) => {
    User.find({email: req.body.email})
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'There is a account with this email yet.'
                })
            }
            //Create user.
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(result => {
                            return res.status(201).json({
                                message: 'User created',
                                user: {
                                    _id: result._id,
                                    email: result.password
                                }
                            });
                        })//then
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        });
}

exports.users_login = (req, res, next) => {
    User.find({email: req.body.email})
        .then(user => {
            if (user.length < 1) {
                //401 no authorized
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            //check login
            bcrypt.compare(req.body.password, user[0].password, (err, resp) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                //login validation
                if (resp) {
                    //JWT
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h',

                        });
                    //Login
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }

                // If there is another error
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        });
}
exports.users_delete = (req, res, next) => {
    User.findByIdAndDelete(req.params.userId)
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            res.status(200).json({
                message: 'User deleted successfully',
                description: 'Delete user by id',
                data: result.email,
                request: {
                    type: 'POST',
                    url: 'https://localhost:3000/user/signup',
                    body: {email: "String", password: "String"}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}