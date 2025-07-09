const productDTO = require('../DTO/product_DTO');
const productService = require('../services/productServices');
const Product = require('../models/product');
const productMapper = require('../mappers/product_mappers');

const API_ProductController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await productService.getAllProducts();
            const productsDTO = productMapper.toOutputListDTO(products);
            return res.status(200).json({ message: 'Products retrieved successfully', products: productsDTO });
        }
        catch (error) {
            console.error('Error retrieving products:', error);
            return res.status(500).json({
                message: 'Internal Server Error', error: error
            });
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
            const savedProductDTO = productMapper.toOutputDTO(savedProduct);
            return res.status(201).json({ message: 'Product added successfully', product: savedProductDTO });
        }
        catch (error) {
            console.error('Error adding product:', error);
            return res.status(400).json({ message: 'Error adding product', error: error.message });
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

            return res.status(200).json({ message: 'Product updated successfully', product: productMapper.toOutputDTO(product) });
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
    },

    getProductBySlug: async (req, res) => {
        const slug = req.params.slug;
        try {
            if (!slug) {
                throw new Error('Product slug is required');
            }
            const product = await productService.getProductBySlug(slug);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json({ message: 'Product retrieved successfully', product: productMapper.toOutputDTO(product) });
        }
        catch (error) {
            console.error('Error retrieving product by slug:', error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
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
            const productDTO = productMapper.toOutputDTO(product);
            return res.status(200).json(productDTO);
        }
        catch (error) {
            console.error('Error fetching product by ID:', error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },
}

module.exports = API_ProductController;