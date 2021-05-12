// const cookieParser = require('cookie-parser');
const express = require('express');
const port = 8000;
const expressLayouts = require('express-ejs-layouts')
const db = require('./config/mongoose')

// Used for session cookie
const session = require('express-session');
const passport = require('passport')
const passportLocal = require('./config/passport_local_strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const passportJWT = require('./config/passport-jwt-strategy');


//mongo store
const MongoStore = require('connect-mongo')(session);

//sass
const sassMiddleware = require('node-sass-middleware');


let app = express();

//calling & compiling sass or scss
app.use(sassMiddleware({
    src : './assets/scss',
    dest : './assets/css',
    debug : true,
    outputStyle : 'expanded',
    prefix :'/css'
}))

app.use(express.urlencoded());
// app.use(cookieParser());

app.use(expressLayouts);

//calling static files
app.use(express.static('./assets'))

//extracting styles & scripts & putting into layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views')


// mongo store is used to store session cookie in db
app.use(session({
    name : 'test',
    //todo change the secret key before deployment
    secret : 'test-key',
//if the user is not signed in , then do you want to save extra data in session cookie (no), then false
    saveUninitialized : false,
//if no changes are made to the existing data do you want to rewrite the cookie id
    resave : false,
    cookie : {
        maxAge : (1000 * 60 * 100)
    },
    // setting up mongostore for storing cookies
    store : new MongoStore(
        {
            mongooseConnection : db,
            autoRemove : 'disabled'
        },
        function(err){
            console.log(err || 'connected to mongodb')
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes/index'))

app.listen(port, function(err){
    if(err){console.log(`Server is down`)};
    console.log(`Server is running on port ${port}`);
})