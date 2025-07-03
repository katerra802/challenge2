const Product = require('../models/product');

const productServices = {
    getAllProducts: async () => {
        try {
            const products = await Product.find();
            console.log('Products fetched successfully:', products);
            return products;
        }
        catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
    postAddProduct: async (product) => {
        try {
            if (!product || !product.name || !product.slug) {
                throw new Error('Product name and slug are required');
            }

            const savedProduct = await product.save();
            console.log('Product saved successfully:', savedProduct);
            return savedProduct;
        }
        catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    },
    getProductById: async (id) => {
        try {
            if (!id) {
                throw new Error('Product ID is required');
            }

            const product = await Product.findById(id);
            return product;
        }
        catch (error) {
            console.error('Error fetching product by ID:', error);
            return {};
        }
    },

    getProductBySlug: async (slug) => {
        try {
            if (!slug) {
                throw new Error('Product slug is required');
            }

            const product = await Product.find({ slug: slug });
            return product;
        }
        catch (error) {
            console.error('Error fetching product by ID:', error);
            return {};
        }
    }
}

module.exports = productServices;