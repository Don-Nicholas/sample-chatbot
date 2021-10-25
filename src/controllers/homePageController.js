let getHomePage = (req, res) => {
    res.render("homepage.ejs");
};

module.exports = {
    getHomePage : getHomePage
};