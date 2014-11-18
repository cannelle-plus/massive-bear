var authStaticUser = function(user) {
	return function(app, middleware) {

		if (user) middleware.login(user);
	};
};

module.exports = authStaticUser;