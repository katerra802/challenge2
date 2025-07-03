const express = require('express');
const path = require('path');
const router = express.Router();
const homeController = require('../controllers/homeController');
const accountController = require('../controllers/accountController');
const productController = require('../controllers/productController');
//products  
router.get('/product-page', productController.getProductPage);
router.post('/new-product', productController.postAddProduct);
router.get('/product/:id', productController.getProductById);
router.get('/product/slug/:slug', productController.getProductBySlug);
router.put('/product-update/:id', productController.putUpdateProduct);
router.delete('/product-delete/:id', productController.deleteProduct);
router.get
//end products

module.exports = router;