const ProductOutputDTO = require('../DTO/output/productDTO');

const productMapper = {
    toOutputDTO: (product) => {
        if (!product) {
            return null;
        }
        return new ProductOutputDTO(product);
    },

    toOutputListDTO: (products) => {
        if (!products || products.length === 0) {
            return [];
        }
        return products.map(product => new ProductOutputDTO(product));
    }
}

module.exports = productMapper;