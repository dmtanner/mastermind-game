 var crypto = require('crypto');
 var mongoose = require('mongoose'),
     User = mongoose.model('User'),
     Highscore = mongoose.model('Highscore');
 function hashPW(pwd){
   return crypto.createHash('sha256').update(pwd).
          digest('base64').toString();
 }
 exports.signup = function(req, res){
   console.log("In Signup Controller");
   var query = User.where({username:req.body.username});

   query.findOne(function(err, data) {
		   if(data === null) {
				   var user = new User({username:req.body.username});
				   console.log("User set");
				   user.set('hashed_password', hashPW(req.body.password));
				   console.log("Password set");
				   user.set('email', req.body.email);
				   console.log("Email set");
				   user.save(function(err) {
					 if (err){
					   console.log("Error in saving user" + err);
					   res.session.error = err;
					   res.redirect('/signup');
					 } else {
					   req.session.user = user.id;
					   req.session.username = user.username;
					   req.session.msg = 'Authenticated as ' + user.username;
					   res.redirect('/');
					 }
				   });
   			}
			else {
			   console.log("Error in saving user" + err);
			   //res.session.error = err;
			   res.redirect('/signup');
			}
 	});
 }

 exports.login = function(req, res){
   console.log("In Login Controller");
   console.log(req.body);
   User.findOne({ username: req.body.username })
   .exec(function(err, user) {
	 console.log("In Login Controller Exec");
     if (!user){
       err = 'User Not Found.';
	   console.log("User not found");
     } else if (user.hashed_password ===
                hashPW(req.body.password.toString())) {
       console.log("Password Correct!");
	   req.session.regenerate(function(){
		 console.log("user.id: " + user.id);
         req.session.user = user.id;
		 console.log("user.username: " + user.username);
         req.session.username = user.username;
         req.session.msg = 'Authenticated as ' + user.username;
         res.redirect('/');
		 console.log("user authenticated correctly");
       });
     }else{
       err = 'Authentication failed.';
     }
     if(err){
       req.session.regenerate(function(){
         req.session.msg = err;
         res.redirect('/login');
       });
     }
   });
 };
 exports.getUserProfile = function(req, res) {
   User.findOne({ _id: req.session.user })
   .exec(function(err, user) {
     if (!user){
       res.json(404, {err: 'User Not Found.'});
     } else {
       res.json(user);
     }
   });
 };
 exports.updateUser = function(req, res){
   User.findOne({ _id: req.session.user })
   .exec(function(err, user) {
     user.set('email', req.body.email);
     user.set('color', req.body.color);
     user.save(function(err) {
       if (err){
         res.session.error = err;
       } else {
         req.session.msg = 'User Updated.';
       }
       res.redirect('/user');
     });
   });
 };
 exports.deleteUser = function(req, res){
   User.findOne({ _id: req.session.user })
   .exec(function(err, user) {
     if(user){
       user.remove(function(err){
         if (err){
           req.session.msg = err;
         }
         req.session.destroy(function(){
           res.redirect('/login');
         });
       });
     } else{
       req.session.msg = "User Not Found!";
       req.session.destroy(function(){
         res.redirect('/login');
       });
     }
   });
 };
exports.highscore = function(req, res) {
	
   console.log("In Highscore Controller");

   var highscore = new Highscore({username:req.body.username});
   highscore.set('score', req.body.score);
   highscore.save(function(err) {
	 if (err){
	   console.log("Error in saving highscore" + err);
	   res.session.error = err;
	   res.redirect('/');
	 }
   });
};
