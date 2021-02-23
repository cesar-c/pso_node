const { Router } = require('express');
const router = Router();


const {isAuthenticated, isAdmin} =  require('../helpers/auth');

const { renderForm,
        infoProduct,
        listProducts,
        listProductsView,
        createNewProduct,
        renderEditForm,
        updateProduct,
        deleteProduct } = require('../controllers/products.controller');
/*
//create new product
router.get('/products/add',[isAuthenticated,isAdmin],renderForm);
router.post('/products/add',[isAuthenticated,isAdmin],createNewProduct);
*/

//Get product
router.get('/products/info/:id',infoProduct);

/*
//List products
router.get('/products/list',[isAuthenticated,isAdmin],listProductsView);
*/

//Get all products
router.get('/products',listProducts);

/*
//Edit note
router.get('/products/edit/:id',[isAuthenticated,isAdmin],renderEditForm);
router.put('/products/edit/:id',[isAuthenticated,isAdmin],updateProduct);

//Delete notes
router.delete('/products/delete/:id',[isAuthenticated,isAdmin], deleteProduct);
*/
module.exports = router;