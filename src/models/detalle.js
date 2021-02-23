const conection = require('../database/conection');


const detalle_model = {};

detalle_model.query = '',

detalle_model.values = [];


detalle_model.insert = function(id,data){
    this.query = "INSERT INTO sh_empresa_20526131089.tb_pso_detallesolicitudcotizacion "
                    + " (tb_detallesolicitudcotizacion_des,tb_detallesolicitudcotizacion_can, "
                    + "tb_solicitudcotizacion_id,tb_producto_id) VALUES ";

    let temp = 1;
    for(const {detalle,count,tb_producto_id} of data){
        this.values.push(detalle,count,id ,tb_producto_id);
        if(temp !== 1){
            this.query += " , ";
        }
        this.query += ` ($${temp},$${temp+1},$${temp+2},$${temp+3}) `;
        temp = temp+4;
    }

    return this.execute();
}

detalle_model.execute = async function(){
    try{
        const result = await conection.query(this.query,this.values);
        this.query = '';
        this.values = [];
        return {
            err: false,
            result: result.rows
        }
    }catch(e){
        console.log(this.query);
        console.log(this.values);
        console.log('>>>>>>>>>>>>>>>>>>>>>', e);
        this.query = '';
        this.values = [];
        return {
            err: true,
            info: e
        }
    }
    
}

module.exports = detalle_model;