const solidCtrl = {};
const Solicitud = require('../models/solicitud');
const mailer = require('../config/nodemailer');



solidCtrl.renderCancelar = (req,res)=>{
    const url = req.url;
    res.render('users/cancel_req',{
        layout: 'color_plain',
        url
    });
}

solidCtrl.addSolid = async (req,res) =>{
    const id = req.user.tb_persona_id;
    const email = req.user.tb_persona_corele;
    const result = await Solicitud.insert(id,req.body);
    let msg = "<h3>Datos de la solicitud</h3> ";
    for (const item of req.body.items) {
        msg += `
            <h4>${item.tb_producto_nom}</h4>
            <p>Cantidad (${item.tb_producto_unimed}) : ${item.count} </p>
            <br>
        `;
    }
    msg += `<a href='http://${process.env.APP_HOST}/solid/${result.new_solic.tb_solicitudcotizacion_id}/${result.new_solic.tb_solicitudcotizacion_numcor}/${id}'>Cancelar solicitud</a>`;
    let info = await mailer.sendMail({
      from: 'TIENDA ONLINE',
      to: email,
      subject: "Infommación de solicitud",
      text: "Infommación de solicitud",
      html: msg
    });
    res.json({
        err: false,
        info: "Insertado correctamente"
    })
}

solidCtrl.cancelarSolicitud = async (req,res) =>{
    const id = req.params.solid;
    let result = Solicitud.cancel(Number(id));
    if(!result.err){
        req.flash('success_msg','Solicitud cancelada');
        res.redirect('/');
    }else{
        console.log(result);
    }
}



module.exports = solidCtrl;