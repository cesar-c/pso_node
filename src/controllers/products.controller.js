const productCtrl = {};

const conection = require('../database/conection');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');


productCtrl.renderForm = async (req,res) =>{
    const units = await conection.query('SELECT * FROM units');
    res.render('products/form',{
        create: true,
        product: {},
        units: units.rows
    });
}

productCtrl.infoProduct = async (req,res) => {
    let id = req.params.id;
    /*
    const query = 'SELECT * FROM sh_empresa_20526131089.tb_pso_producto ' + 
                    ' WHERE tb_producto_id = $1';
    const product = await conection.query(query,[id]);*/
    const product = await Product.select(' * ',{"tb_producto_id" : id}).execute();
    const productInfo = product.result.map(BuscaImagen);
    res.json({
        product: productInfo
    });
}

productCtrl.listProductsView = async (req,res) => {
    let query = 'SELECT p.id, p.name, p.img,p.description,u.name as u_name, u.symbol as u_symbol  FROM products p INNER JOIN units u ON p.unitId = u.id LIMIT 8;';
    const products = await conection.query(query);
    let nRows =  await conection.query('SELECT COUNT(*) FROM products ;');
    nRows = nRows.rows[0].count;
    const nPages = Math.ceil(nRows/8);
    res.render('products/list',{products: products.rows, nPages});
}

productCtrl.listProducts = async (req,res)=>{
    let limit = req.query.limit || 12;
    limit = Number(limit);
    let page = req.query.page || 1;
    page = Number(page);
    let offset = (page-1)*limit;
    /*
    let query = 'SELECT * FROM sh_empresa_20526131089.tb_pso_producto LIMIT $1 OFFSET $2;';
    const products = await conection.query(query,[limit,offset]);
    let nRows =  await conection.query('SELECT COUNT(*) FROM sh_empresa_20526131089.tb_pso_producto ;');
    nRows = nRows.rows[0].count;
    */
    let products = await Product.select(' * ').limit(limit).offset(offset).execute();
    let nRows  = await Product.select(' COUNT(*) ').execute();
    nRows = nRows.result[0].count;
    const productEdit = products.result.map(BuscaImagen);
    const nPages = Math.ceil(nRows/limit);
    res.json({
        products: productEdit,
        nPages,
        page
    });
}

productCtrl.createNewProduct = async (req,res) => {
    const {name, description,unitId} = req.body;
    let archivo = req.files.img;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let errors = validateProduct(name,extension);
    if(errors.length > 0){
        const units = await conection.query('SELECT * FROM units');
        return res.render('products/form',{
            errors,
            create: true,
            product: {name, description,unitId},
            units: units.rows
        });
    }else{
        let nombreArchivo = `${id}-${req.user.id}-${ new Date().getMilliseconds()}.${extension}`;
        const query = 'INSERT INTO products (name,description,unitid,img) VALUES ($1,$2,$3,$4)';
        const values = [name,description,unitId,nombreArchivo];
        await conection.query(query,values);
        await archivo.mv(`src/public/img/products/${nombreArchivo}`);
        req.flash('success_msg','Producto registrado');
        res.redirect('/products/list');
    }
}

productCtrl.renderEditForm = async (req,res) => {
    
    let id = req.params.id;
    id = Number(id);
    const product = await conection.query('SELECT * FROM products WHERE id = $1;',[id]);
    const units = await conection.query('SELECT * FROM units;');
    res.render('products/form',{
        create: false,
        product: product.rows[0],
        units: units.rows
    });
}

productCtrl.updateProduct = async (req,res) => {
    let id = req.params.id;
    id = Number(id);
    const {name, description,unitId} = req.body;
    let archivo = req.files.img;
    let extension;
    if(archivo){
        let nombreCortado = archivo.name.split('.');
        extension = nombreCortado[nombreCortado.length - 1];
    }else{
        extension = 'png';
    }

    let errors = validateProduct(name,extension);
    if(errors.length > 0){
        const units = await conection.query('SELECT * FROM units');
        let img = await conection.query('SELECT img FROM products WHERE id=$1',[id]);
        img = img.rows[0].img;
        return res.render('products/form',{
            errors,
            create: false,
            product: {name, description,unitid:unitId},
            units: units.rows
        });
    }else{
        if(archivo){   
            let nombreArchivo = `${id}-${req.user.id}-${ new Date().getMilliseconds()}.${extension}`;
            await borrarImagen(id);
            const query = 'UPDATE products SET name = $1, description = $2 , unitid = $3 , img = $4 WHERE id = $5';
            const values = [name,description,unitId,nombreArchivo,id];
            await conection.query(query,values);
            await archivo.mv(`src/public/img/products/${nombreArchivo}`);
            
            
        }else{
            const query = 'UPDATE products SET name = $1 , description = $2 , unitid = $3 WHERE id = $4';
            const values = [name,description,unitId,id];
            await conection.query(query,values);
        }
        req.flash('success_msg','Producto registrado');
        res.redirect('/products/list');
    }
}

productCtrl.deleteProduct = async (req,res) => {
    let id = req.params.id;
    id = Number(id);
    await conection.query('UPDATE products SET state = false');
    res.redirect('/products/list');
}


function validateProduct(name,extension){
    const errors = [];
    if(name.length > 25){
        errors.push({text: 'El nombre supera los 25 caracteres'});  
    }
    if(extension !== 'png' && extension !== 'jpg'){
        errors.push({text: 'La imagen no es png o jpg'});  
    }
    return errors;
}
async function  borrarImagen(id){
    let img = await conection.query('SELECT img FROM products WHERE id=$1',[id]);
    img = img.rows[0].img;

    let pathImagen = path.resolve(__dirname,`../public/img/products/${img}`);

        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}



// Buscar imagen
function BuscaImagen (product){
    let codigoProducto = product.tb_producto_cod;
    let pathImagen = path.resolve(__dirname,`../public/img/products/${codigoProducto}`);
    let imgName = 'noimage.png';
    if(fs.existsSync(pathImagen + '.jpg')){
        imgName = `${codigoProducto}.jpg`;
    }else if(fs.existsSync(pathImagen + '.png')){
        imgName = `${codigoProducto}.png`;
    }
    product.img = imgName;
    return product;
}

module.exports = productCtrl;