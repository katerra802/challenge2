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
    },

    getProductById: async (req, res) => {
        const id = req.params.id;
        try {
            if (!id) {
                throw new Error('Product ID is required');
            }
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        }
        catch (error) {
            console.error('Error fetching product by ID:', error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },

    getProductBySlug: async (req, res) => {
        const slug = req.params.slug;
        try {
            if (!slug) {
                throw new Error('Slug Product is required');
            }
            const product = await productService.getProductBySlug(slug);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        }
        catch (error) {
            console.error('Error fetching product by ID:', error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },

    putUpdateProduct: async (req, res) => {
        const id = req.params.id;
        const { name, slug, quantity } = req.body;
        try {
            if (!id) {
                throw new Error('Product ID is required');
            }
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (!name || !slug) {
                throw new Error('Product name and slug are required');
            }
            else {
                product.name = name;
                product.slug = slug;
                product.quantity = quantity || 0;
            }
            product.save();
            return res.status(200).json({ message: 'Product updated successfully', product: product });
        }
        catch (error) {
            console.error('Error updating product:', error);
            return res.status(400).json({ message: 'Error updating product', error: error.message });
        }
    },

    deleteProduct: async (req, res) => {
        const id = req.params.id;
        try {
            if (!id) {
                throw new Error('Product ID is required');
            }
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            await Product.deleteOne({ _id: id });
            return res.status(200).json({ message: 'Product deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
}

module.exports = productController;