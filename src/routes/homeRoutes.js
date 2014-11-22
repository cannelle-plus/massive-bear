var assert = require('chai').assert;


var homeRoutes = function() {

	// var writeError = function(err) {
	// 	console.log(err);
	// };

	this.index = {
		url: "/",
		verb: "GET",
		extract: function() {},
		execute: function() {},
		handles: function(session) {
			return function(req, res) {
				if (!session) {
					var options = {
						root: './www-root/',
						dotfiles: 'deny',
						headers: {
							'x-timestamp': Date.now(),
							'x-sent': true
						}
					};
					res.sendFile('home.html', options);
				} else {
					res.redirect(302, "/games");
				}
			};
		}
	};

};

module.exports = homeRoutes;