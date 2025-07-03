const productsService = require('../services/productServices');
const homeController = {
    homePage: async (req, res) => {
        const products = await productsService.getAllProducts();
        return res.render('homePage.ejs', { lstProducts: products });

    }
};

module.exports = homeController;