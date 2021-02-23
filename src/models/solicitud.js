const conection = require('../database/conection');
const Detalle = require('../models/detalle');


const solicitudcotizacion_model = {};

solicitudcotizacion_model.query = '',

solicitudcotizacion_model.values = [];

solicitudcotizacion_model.select = function (colums,conditions = null){
    let query = `SELECT ${colums} FROM sh_empresa_20526131089.tb_pso_solicitudcotizacion `;
    let Loop = 1;
    if(conditions){
        for(const key in conditions ){
            if(Loop ===1){
                query += ' WHERE ';
            }else{
                query += ' AND '
            }
            query += ` ${key} = $${Loop} `;

            Loop++;
        }
    }
    this.query = query;

    if(conditions){
        this.values = Object.values(conditions);
    }
    return this;
}



solicitudcotizacion_model.insert = async function (id,json){
    this.query = 'INSERT INTO sh_empresa_20526131089.tb_pso_solicitudcotizacion '
                    +" (tb_solicitudcotizacion_ani,tb_solicitudcotizacion_mes,tb_solicitudcotizacion_numcor,tb_solicitudcotizacion_obs,tb_persona_id,tb_solicitudcotizacion_tip)"
                    +" VALUES ($1,$2,$3,$4,$5,$6) RETURNING * ";
    const date = new Date();
    let numCorrel = await this.countxmonth();

    numCorrel = "000" + (numCorrel + 1);
    numCorrel = numCorrel.slice(-4);
    let anio = date.getFullYear() ;
    let mes = date.getMonth() + 1;
    mes = "0" + mes;
    mes = mes.slice(-2);
    this.values = [anio,mes, numCorrel ,json.descrp,id,"P"];
    //conection.query(this.query,values);

    const new_solic = await this.execute();
    if(new_solic.err === false){
        let detalles = await Detalle.insert(new_solic.result.rows[0].tb_solicitudcotizacion_id,json.items);
        return {
            new_solic: new_solic.result.rows[0],
            detalles
        }
    }else{
        return new_solic;
    } 
}

solicitudcotizacion_model.countxmonth = async function(){
    const date = new Date();
    let month = date.getMonth() + 1;
    month = "0" + month;
    month = month.slice(-2);
    let year = date.getFullYear();
    year = String(year);
    const query = "SELECT COUNT(*) FROM sh_empresa_20526131089.tb_pso_solicitudcotizacion "+
                    " WHERE tb_solicitudcotizacion_mes=$1 AND tb_solicitudcotizacion_ani=$2";
    const result = await  conection.query(query,[month,year]);
    return result.rows[0].count;
}

solicitudcotizacion_model.cancel = async function(id){
    this.query =  "UPDATE sh_empresa_20526131089.tb_pso_solicitudcotizacion SET "
                    + " tb_solicitudcotizacion_fechoranu=$1,tb_solicitudcotizacion_est=$2";
    this.values = ["now()","A"];
    return this.execute();
}

solicitudcotizacion_model.execute = async function(){
    try{
        const result = await conection.query(this.query,this.values);
        this.query = '';
        this.values = [];
        return {
            err: false,
            result: result
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


module.exports = solicitudcotizacion_model;