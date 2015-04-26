var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var express = require('express');
var users = require('../controllers/users_controller');

var mastermind = require('../controllers/mastermind');

router.use('/static', express.static( './static'));

router.get('/mastermind', function(req, res) {

  console.log("in /mastermind route");
  if (req.session.user) {
    console.log("User has session");
    //req.headers['cache-control'] = 'no-cache';
    res.render('mastermindGamePage');

  } else {
    console.log("User does not have session");
    req.session.msg = 'Access denied!';
    res.redirect('/login');
  }
});

// Mastermind REST services

router.param('gameid', function(req, res, next, id) {
    req.gameid = parseInt(id);
    return next();
});

router.post('/mastermind/start', function(req, res) {
    console.log("Starting new mastermind game...");
    console.log(req.body);
    if (req.session.user) {
        if (req.body.code_length == undefined) req.body.code_length = 4;
        if (req.body.max_guesses == undefined) req.body.max_guesses = 15;
        res.send(mastermind.startCPUGame(req.session.user, req.body.code_length, req.body.max_guesses));
    } else {
        console.log("User does not have session");
        req.session.msg = 'Access denied!';
        res.redirect('/login');
    }
});

router.post('/mastermind/:gameid/guess', function(req, res) {
    console.log("Making a guess...");
    console.log(req.body);
    if (req.session.user) {
        console.log("Guess request: " + req);
        res.send(mastermind.makeGuess(req.gameid, req.session.user, req.body.guess, req.session.username));
    } else {
        console.log("User does not have session");
        req.session.msg = 'Access denied!';
        res.redirect('/login');
    }
});

router.post('/mastermind/:gameid/history', function(req, res) {
    console.log("Getting guess history...");
    console.log(req.body);
    if (req.session.user) {
        res.send(mastermind.getGuessHistory(req.gameid, req.session.user));
    } else {
        console.log("User does not have session");
        req.session.msg = 'Access denied!';
        res.redirect('/login');
    }
});

router.delete('/mastermind' , function(req, res) {
    if (req.session.user) {
        mastermind.deleteAllGames();
        res.send(JSON.stringify({message: "deleted all games"}));
    } else {
        console.log("User does not have session");
        req.session.msg = 'Access denied!';
        res.redirect('/login');
    }
});

// Login routes
router.get('/', function(req, res){
  console.log("in / route");
  if (req.session.user) {
    console.log("User has session");
    //req.headers['cache-control'] = 'no-cache';
    res.render('index', {username: req.session.username,
                         msg:req.session.msg});
  } else {
    console.log("User does not have session");
    req.session.msg = 'Access denied!';
    res.redirect('/login');
  }
});
/*
// this route prevents "304" code from thinking view is already cached
router.get('/*', function(req, res, next){
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next();
});
*/
router.get('/user', function(req, res){
  if (req.session.user) {
    res.render('user', {msg:req.session.msg});
  } else {
    req.session.msg = 'Access denied!';
    res.redirect('/login');
  }
});
router.get('/signup', function(req, res){
  if(req.session.user){
    res.redirect('/');
  }
  res.render('signup', {msg:"Signup Screen!"});
});
router.get('/login',  function(req, res){
  if(req.session.user){
    res.redirect('/');
  }
  res.render('login', {msg:"Login Screen!"});
});
router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

// Post Login Routes
router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);

module.exports = router;
