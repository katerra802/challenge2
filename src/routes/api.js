const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const productValidation = require('../DTO/product_DTO');
const API_UserController = require('../controllers/API_UserController');
const API_ProductController = require('../controllers/API_ProductController');
const userValidation = require('../DTO/user_DTO');
const validation = require('../middleware/validation');

//products  
/**
 * @swagger
 * /v1/api/product-page:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
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
 *                   slug:
 *                     type: string
 *                   quantity:
 *                     type: number
 */
router.get('/product-page', authMiddleware, API_ProductController.getAllProducts);

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
 *                 example: "sample-slug"
 *               quantity:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *       400:
 *         description: Bad request, validation error
 *       403:
 *         description: wrong role, only admin can add product
 */
router.post('/new-product', authMiddleware, validation(productValidation.createProductSchema), userValidation.checkRoleAdmin('admin'), API_ProductController.postAddProduct);

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
router.get('/product/:id', API_ProductController.getProductById);

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

router.get('/product/slug/:slug', API_ProductController.getProductBySlug);
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
 *       400:
 *         description: Bad request, validation error
 *       403:
 *         description: wrong role, only admin can add product
 */
router.put('/product-update/:id', authMiddleware, validation(productValidation.updateProductSchema), userValidation.checkRoleAdmin('admin'), API_ProductController.putUpdateProduct);

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
 *       403:
 *         description: wrong role, only admin can delete product
 */
router.delete('/product-delete/:id', authMiddleware, userValidation.checkRoleAdmin('admin'), API_ProductController.deleteProduct);


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
 *                 example: "quan802368@gmail.com"
 *               password:
 *                 type: string
 *                 example: "1"
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
 * /v1/api/logout:
 *   post:
 *     summary: User logout
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Unauthorized, user not logged in
 */

router.post('/logout', API_UserController.postLogout);

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
router.get('/list-users', API_UserController.getUsersList);
//end user

// refresh token
router.post('/refresh-token', API_UserController.refreshToken);
//

module.exports = router;