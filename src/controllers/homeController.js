const productsService = require('../services/productServices');
const jwt = require('jsonwebtoken');

const homeController = {
    homePage: async (req, res) => {
        if (!req.cookies.accessToken && !req.cookies.refreshToken) {

            return res.render('homePage.ejs', { lstProducts: {}, verify: false });
        }

        const products = await productsService.getAllProducts();
        return res.render('homePage.ejs', { lstProducts: products, verify: true });

    }
};

module.exports = homeController;