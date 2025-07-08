const productDTO = require('../DTO/product_DTO');
const productService = require('../services/productServices');
const API_ProductController = {

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
            return res.status(201).json({ message: 'Product added successfully', product: new productDTO(savedProduct) });
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
            return res.status(200).json({ message: 'Product updated successfully', product: new productDTO(product) });
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

module.exports = API_ProductController;