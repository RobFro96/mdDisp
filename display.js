const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const LocalStrategy = require('passport-local').Strategy

var Display = function (config, files) {
    this.config = config;
    this.files = files;

    passport.use(new LocalStrategy({ usernameField: 'name' }, this.authenticateUser.bind(this)));
    passport.serializeUser((user, done) => done(null, user.name));
    passport.deserializeUser((id, done) => {
        let user = this.config.get("users").value().find(user => user.name === id);
        return done(null, user)
    });

    this.app = express();
    this.app.set('view-engine', 'ejs');
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static('public'));
    this.app.use(flash());
    this.app.use(session({
        secret: this.config.get("session_secret").value(),
        resave: false,
        saveUninitialized: false
    }));

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(methodOverride('_method'));

    this.app.get('/', checkAuthenticated, this.files.routeRoot.bind(this.files));
    this.app.get('/files/:folder', checkAuthenticated, this.files.routeFiles.bind(this.files));
    this.app.get('/files/:folder/:path(*)', checkAuthenticated, this.files.routeFiles.bind(this.files));
    this.app.get('/file/:folder/:path(*)', checkAuthenticated, this.files.routeFile.bind(this.files));

    this.app.get('/login', checkNotAuthenticated, (req, res) => {
        res.render('login.ejs');
    });

    this.app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    this.app.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/login')
    });

    // Handle 404
    this.app.use(function (req, res) {
        res.status(404).send('404: Page not Found @RF');
    });

    // // Handle 500
    // this.app.use(function (error, req, res, next) {
    //     res.status(500).send('500: Internal Server Error @RF');
    // });

    this.app.listen(this.config.get("port").value());

}

Display.prototype.authenticateUser = async function (name, password, done) {
    let user = this.config.get("users").value().find(user => user.name === name);
    if (user == null) {
        return done(null, false, { message: "login failed." });
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: "login failed." });
        }
    } catch (e) {
        return done(e)
    }
}

let checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};


let checkNotAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

module.exports = Display;