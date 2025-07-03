const productService = require('../services/productServices');
const Product = require('../models/product');


const productController = {
    getProductPage: async (req, res) => {
        try {
            const products = await productService.getAllProducts(req, res);
            if (products.length === 0) {
                return res.status(404).send('No products found');
            }
            return res.status(200).json(products);
        }
        catch (error) {
            console.error('Error fetching product page:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    postAddProduct: async (req, res) => {
        const { name, slug, quantity } = req.body;
        try {
            if (!name || !slug) {
                throw new Error('Product name and slug are required');
            }
            const product = new Product({
                name: name,
                slug: slug,
                quantity: quantity || 0
            });
            const savedProduct = await productService.postAddProduct(product);
            return res.status(201).json({ message: 'Product added successfully', product: savedProduct });
        }
        catch (error) {
            console.error('Error adding product:', error);
            return res.status(400).json({ message: 'Error adding product', error: error.message });
        }
    }
}

module.exports = productController;