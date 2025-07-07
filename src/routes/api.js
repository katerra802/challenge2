const express = require('express');
const path = require('path');
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');

//products  
router.get('/product-page', productController.getProductPage);
router.post('/new-product', productController.postAddProduct);
router.get('/product/:id', productController.getProductById);
router.get('/product/slug/:slug', productController.getProductBySlug);
router.put('/product-update/:id', productController.putUpdateProduct);
router.delete('/product-delete/:id', productController.deleteProduct);
router.get('/list-users', userController.APIgetUsersList);
//end products

// refresh token
router.post('/refresh-token', userController.refreshToken);
//

module.exports = router;