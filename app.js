if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

console.log(process.env.secret)

const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const Review = require('./models/review')
const ejsMate = require('ejs-mate')

const ExpressError = require('./utils/ExpressError')
const campgroundRoute = require('./routes/campground')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/user')
const { campgroundSchema, reviewSchema } = require('./schemas');
const campground = require('./models/campground');
const session =  require('express-session')
const flash = require('connect-flash');
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./models/user')
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


mongoose.connect('mongodb://localhost:27017/yelp-camp', 
    {    
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
    }
)


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database connected')
})

app.set('view engine', 'ejs')

app.use(session(sessionConfig))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.engine('ejs', ejsMate)

app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'))

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if(!err.message) err.message = 'Oh no, Something went wrong'
    res.status(statusCode).render('error', { err })
   
})

app.listen(3000, () => {
    console.log('Listening On Port 3000')
})