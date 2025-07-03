const homeController = {
    homePage: (req, res) => {
        return res.status(200).render('homePage.ejs');
    }
};

module.exports = homeController;