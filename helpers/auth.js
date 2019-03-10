module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) return next()
        req.flash('success_msg', 'Not Authenticated')
        res.redirect('/users/login')
    }
}