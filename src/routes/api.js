const express = require('express');
const path = require('path');
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const productValidation = require('../middleware/product_validation');
const API_UserController = require('../controllers/API_UserController');


//products  
router.get('/product-page', productController.getProductPage);

/**
 * @swagger
 * /v1/api/new-product:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sample name"
 *               slug:
 *                 type: string
 *                 example: "Sample slug"
 *               quantity:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/new-product', authMiddleware, productValidation.validate(productValidation.createProductSchema), productController.postAddProduct);

/**
 * @swagger
 * /v1/api/product/{id}:
 *   get:
 *     summary: Add a new product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 quantity:
 *                   type: number
 */
router.get('/product/:id', productController.getProductById);

/**
 * @swagger
 * /v1/api/product/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: The slug of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 quantity:
 *                   type: number
 */

router.get('/product/slug/:slug', productController.getProductBySlug);

/**
 * @swagger
 * /v1/api/product-update/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 quantity:
 *                   type: number
 */
router.put('/product-update/:id', authMiddleware, productValidation.validate(productValidation.updateProductSchema), productController.putUpdateProduct);

/**
 * @swagger
 * /v1/api/product-delete/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/product-delete/:id', authMiddleware, productController.deleteProduct);


//user
/**
 * @swagger
 * /v1/api/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Email and password are required
 */
router.post('/login', API_UserController.postLogin);

/**
 * @swagger
 * /v1/api/list-users:
 *   get:
 *     summary: Get list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */

router.get('/list-users', userController.APIgetUsersList);
//end products

// refresh token
router.post('/refresh-token', userController.refreshToken);
//

module.exports = router;