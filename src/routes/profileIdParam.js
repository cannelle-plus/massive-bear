var profileIdParam = {
	name : "profileId",
	handles : function(req,res, next, profileId){
		req.profileId = profileId;
		next();
	}
};

module.exports = profileIdParam;