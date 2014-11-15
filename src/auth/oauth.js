var ids = {
	facebook: {
		clientID: '1536474526596015',
		clientSecret: '97f0961242c1f94abf45d3eaeb243399',
		callbackURL: 'http://localhost:8888/auth/facebook/callback'
	},
	// twitter: {
	//  consumerKey: 'get_your_own',
	//  consumerSecret: 'get_your_own',
	//  callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
	// },
	// github: {
	//  clientID: 'get_your_own',
	//  clientSecret: 'get_your_own',
	//  callbackURL: "http://127.0.0.1:1337/auth/github/callback"
	// },
	google: {
		returnURL: 'http://127.0.0.1:8888/auth/google/callback',
		realm: 'http://127.0.0.1:8888'
	}
};

module.exports = ids;