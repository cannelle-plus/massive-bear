var uuid = require('node-uuid');

var authStaticUser = function(bear, tokenId) {
	return function(app, middleware) {

		if (bear) {

			if (tokenId)
				bear.userId = tokenId;
			else
				bear.userId = uuid.v1();

			//save the session bear
			var bearSession = middleware.login(bear);


			//add the bear authtentication to the current request
			app.use(function(req, res, next) {

				req.user = {
					userId: bear.userId,
					userName: bear.username
				};



				next();
			});
		}

	};
};

module.exports = authStaticUser;