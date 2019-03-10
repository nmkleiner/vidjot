const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const flash = require('connect-flash')

const app = express()

//Load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

//express session
app.use(session({
    secret: 'laklak',
    resave: true,
    saveUninitialized: true,
}))

//passport config
require('./config/passport')(passport)

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

// flash
app.use(flash())

// Global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

// Connect mongoose
const db = require('./config/db')
mongoose.Promise = Promise
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(() => {
        console.log('mongo connected')
    })
    .catch(err => console.log(err))


// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')


//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'))

app.get('/', (req,res) => {
    const title = 'Welcome'
    res.render('index', {
        title
    })
})

app.get('/about', (req,res) => {
    res.render('about')
})


//use routes
app.use('/ideas', ideas)
app.use('/users', users)

const port = process.env.PORT || 4444;
app.listen(port, () => {
    console.log(`server listening ${port}`)
})

// app.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });