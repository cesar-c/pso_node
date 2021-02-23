const conection = require('../database/conection');


const product_model = {};

product_model.query = '',

product_model.values = [];

product_model.select = function (colums,conditions = null){
    let query = `SELECT ${colums} FROM sh_empresa_20526131089.tb_pso_producto `;
    let Loop = 1;
    if(conditions){
        for(const key in conditions ){
            if(Loop===1){
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

product_model.limit = function(limit){
    let values = this.values;
    console.log(values);
    let num = 1;
    if(values.length > 0){
         num = values.length + 1;
    }
    this.query += ` LIMIT $${num} `;
    this.values.push(limit);
    return this;
}

product_model.offset = function(offset){
    let values = this.values;
    let num = 1;
    if(values.length > 0){
         num = values.length + 1;
    }
    this.query += ` OFFSET $${num} `;
    this.values.push(offset);
    return this;
}

product_model.execute = async function(){
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



module.exports = product_model;