const userCtrl = {};

const passport = require('passport');

//const User = require('../models/User');

const conection = require('../database/conection');
const bcrypt = require('bcryptjs');

userCtrl.renderSignUpForm = (req,res) =>{
    res.render('users/signup');
}

/*
userCtrl.signup = async (req,res) => {
    const errors = [];
    const {name, email, password, confirm_password} = req.body;
    if(password != confirm_password){
        errors.push({text: 'Passwords do not match'});
    }
    if(password.length <4){
        errors.push({text: 'Passwords mut be at least 4 characters'})
    }
    if(errors.length > 0){
        res.render('users/signup',{errors,name,email});
    }else{
//        const emailUser =  await User.findOne({email: email});
        const emailUser = await conection.query('SELECT * FROM users WHERE email=$1',[email]);
        if(emailUser.rowCount ===1){
            req.flash('error_msg', 'The email is already in use.');
        } else {
//            const newUser = new User({name,email,password});
//            newUser.password = await newUser.encrypPassword(password);
//            await newUser.save();
            let role = 'CLIENT_ROLE';
            if(req.user){
                console.log(req.user);
                if(req.user.role === 'MASTER_ROLE'){
                    role = 'ADMIN_ROLE';
                }
            }
            const salt =  await bcrypt.genSalt(10);
            const pass = await bcrypt.hash(password,salt);
            await conection.query('INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4)',[name,email,pass,role]);
            req.flash('success_msg','User is registered');
            if(req.user){
                if(req.user.role === 'MASTER_ROLE'){
                    res.redirect('/');
                }
            }else{
                res.redirect('/users/signin');
            }
           
        }
    }
}
*/

userCtrl.renderSigninForm = (req,res) =>{
    res.render('users/signin');
}

userCtrl.signin = (req,res,next) => {
    passport.authenticate('local',(err,user,info)=>{
        if(err || !user){
            return res.json({
                        err: true,
                        info: info
                    });
        }
        req.login(user, function(err){
            if(err){
                return res.json({
                            err: true,
                            info: err
                        });
            }
            return res.json({
                err:false,
                info: "usuario autenticado"
            })
        });
    })(req,res,next)
}

userCtrl.logout = (req,res) => {
    req.logout();
    req.flash('success_msf','You are logged aout now.');
    res.redirect('/users/signin');
}


module.exports = userCtrl;