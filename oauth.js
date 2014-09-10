var ids = {
facebook: {
 clientID: '695210287226746',
 clientSecret: 'f51c6bb5cd976fc5ce966a44551c820f',
 callbackURL: 'http://127.0.0.1:8888/auth/facebook/callback'
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
 realm: 'http://127.0.0.1:1337'
}
}

module.exports = ids