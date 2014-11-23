var authStaticUser = function(bear) {
	return function(app, middleware) {

		//save the session bear
		if (bear) middleware.login(bear);

		//add the bear authtentication to the current request
		app.use(function(req, res, next) {

			if (bear) req.user = {
					id: bear.userId,
					userName: bear.username
				};



			next();
		});
	};
};

module.exports = authStaticUser;