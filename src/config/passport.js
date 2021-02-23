const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const conection = require('../database/conection');
//const User = require('../models/User');


passport.use(new LocalStrategy({
    usernameField:  'email',
    passwordField: 'password'

}, async (email,password,done)=>{
//    const user = await User.findOne({email});
    const user = await conection.query('SELECT * FROM sh_empresa_20526131089.tb_pso_persona WHERE tb_persona_corele=$1',[email]);
    
    if(user.rowCount === 0){
        return done(null,false,{message: 'Not User found'});
    } else {
        //Math Password's User
        const match = await bcrypt.compare(password,user.rows[0].tb_persona_con,);

        if(match){
            return done(null,user.rows[0]);
        }else{
            return done(null, false,{ message: 'Incorrect Password'});
        }
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.tb_persona_id);
});

passport.deserializeUser((id,done)=>{
    conection.query('SELECT * FROM sh_empresa_20526131089.tb_pso_persona WHERE tb_persona_id=$1',[id],
        (err,user) =>{
            done(err,user.rows[0]);
        } 
    );
    /*
    User.findById(id,(err,user)=>{
        done(err,user);
    })
*/
});

