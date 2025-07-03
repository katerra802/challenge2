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
    }
}

module.exports = productServices;