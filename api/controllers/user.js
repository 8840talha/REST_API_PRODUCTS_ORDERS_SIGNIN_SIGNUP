const mongoose = require('mongoose');
const userSchema = require('../../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
exports.userLogin = (req, res) => {
    userSchema.find({ email: req.body.email }).exec()
        .then(users => {
            if (users.length < 1) {
                res.status(401).json({ success: "false", message: "User Auth Failed" });
            }
            else {
                bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                    if (err) {
                        res.status(401).json({ success: "false", message: "User Auth pass Failed" });
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: users[0].email,
                            userId: users[0]._id,

                        }, process.env.JWT
                            , {
                                expiresIn: "1h"
                            }
                        )
                        res.status(200).json({
                            success: "true",
                            message: "Login Successfull",
                            token: token
                        })
                    }

                })
            }
        })
        .catch(err => res.status(500).json({ error: err }))
}


exports.get_All_Users = (req, res, next) => {
    userSchema.find()
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    count: result.length,
                    success: "true",
                    message: "Users Found",
                    foundUsers: result
                })
            } else {
                res.status(200).json({
                    success: "false",
                    message: "No Users Found"
                })
            }

        })
        .catch(err => res.status(500).json({
            error: err
        }))
}
exports.userSignup = (req, res, next) => {
    userSchema.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    success: "false",
                    message: "User With Mail already Exists"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new userSchema({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    success: "true",
                                    message: 'User Created Successfully'
                                    , created: result
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    success: "false",
                                    message: "error occured",
                                    error: err
                                })
                            })
                    }
                })

            }
        })


}

exports.delete_All_Users = (req, res) => {
    userSchema.remove()
        .exec()
        .then(result => {
            res.status(200).json({
                success: "true",
                message: "Users Deleted Successfully"
            })
        })
        .catch(err => res.status(500).json({ success: "false", error: err }))
}
exports.delete_User_By_Id = (req, res) => {
    userSchema.remove({ _id: req.params.id })
        .exec()
        .then(result => {

            res.status(200).json({
                success: "true",
                message: "User Deleted Successfully"
            })
        })
        .catch(err => res.status(500).json({ success: "false", error: err }))
}