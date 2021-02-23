const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const sesion = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const hbsHelpers = require('./helpers/hbsHelpers');
const bodyParse = require('body-parser');

const path = require('path')

// Initializations
const app = express();
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: hbsHelpers
}));
app.set('view engine','.hbs');

// Middlewares
app.use(fileUpload());
app.use(morgan('dev'));
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());
app.use(methodOverride('_method'));
app.use(sesion({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Gobal Variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
// Routes
app.use(require('./routes/solicitud.routes'));
app.use(require('./routes/index.routes'));
//app.use(require('./routes/notes.routes'));
app.use(require('./routes/users.routes'));
app.use(require('./routes/products.routes'));

// Static Files
app.use(express.static(path.join(__dirname,'public')));

module.exports = app;