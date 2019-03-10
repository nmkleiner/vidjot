const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const mongoose = require('mongoose')

const router = express.Router()

//Load user model
require('../models/User')
const User = mongoose.model('users')

// login GET
router.get('/login', (req,res) => {
    res.render('users/login')
})

// login POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})







// register GET
router.get('/register', (req,res) => {
    res.render('users/register')
})

//register POST
router.post('/register', (req, res) => {
    let errors = []

    if(req.body.password !== req.body.password2) {
        errors.push({text: 'passwords do not match'})
    }
    if(req.body.password.length < 4) {
        errors.push({text: 'password must be at least 4 chars'})
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        User.findOne({email: req.body.email})
            .then(user => {
                if (user) {
                    console.log('user found',user)
                    req.flash('success_msg', 'Email already registered')
                    res.redirect('/users/register')
                }
                else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    })

                    bcrypt.genSalt(10, (err,salt) => {
                        bcrypt.hash(newUser.password, salt, (err,hash) => {
                            if (err) throw err
                            newUser.password = hash
                            newUser.save()
                                .then(() => {
                                    req.flash('success_msg', 'Regsitration successful, go log in!')
                                    res.redirect('/users/login')
                                })
                                .catch(err => {
                                    console.log('err',err)
                                })
                        })
                    })
                }
            })
    }
})

//Logout
router.get('/logout', (req,res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})


module.exports = router

