const helpers = {};

const Solicitud = require('../models/solicitud');

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/signin');
}

helpers.isAdmin = (req, res, next) => {
    console.log(req.user.role);
    if(req.user.role !== 'CLIENT_ROLE'){
        return next();
    }
    res.redirect('/users/signin');
}

helpers.isAuthenticatedJSON = (req, res, next) => {
    if(req.isAuthenticated()){  
        return next();
    }
    res.json({
        err: true,
        info: "usuario no logeado"
    });
}


helpers.validCancel = async (req, res, next) => {
    let values = [];
    values['tb_solicitudcotizacion_id'] = Number(req.params.solid);
    values['tb_solicitudcotizacion_numcor'] = req.params.num;
    values['tb_persona_id'] = Number(req.params.user);
    const result = await Solicitud.select(' COUNT (*) ',values).execute();
    if(result.result.rows[0].count === '1' ){
        next();
    }else{
        res.json({
            err: true,
            info: "Enlace no valido"
        });
    }
}
module.exports = helpers;