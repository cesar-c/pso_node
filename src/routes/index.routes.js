const { Router } = require('express');
const router = Router();

const { renderIndex ,renderAbout , renderStoreProducts } = require('../controllers/index.controller');

router.get('/', renderIndex);

router.get('/about', renderAbout);

router.get('/store/products', renderStoreProducts);

module.exports = router;