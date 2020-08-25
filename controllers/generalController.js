
exports.index = function(req, res) {
    res.render('index');
};

exports.getAboutPage = function(req, res) {
    res.render('aboutus', { pagename: 'AboutUs' });
};
exports.redirectUnknownLink = function(req, res) {
    res.render('pageNotFound');
};