const User = require('../models/user');
module.exports.renderRegister =  (req, res) => {
    res.render('register')
}

module.exports.register = async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const newUser = await User.register(user, password)
        req.login(newUser, e => {
            if(e) return next(e)
            req.flash('success', 'Welcome to Yelpcamp')
            res.redirect('/campgrounds')
        })
       
    } catch(e){
        req.flash('error', e.message)
        res.redirect('register')
    }
    
  
}

module.exports.renderLogin = (req, res) => {
    res.render('login')
}

module.exports.login = (req, res)=> {
    req.flash('success', 'Welcome Back!!!')
    const redirecturl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirecturl)
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have logged out')
    res.redirect('/campgrounds')
}