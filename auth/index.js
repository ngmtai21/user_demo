const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');
const helpers = require('../helpers');

const fetchUser = ((username, password) => {
  password = helpers.encrypt.md5(password);
  // return db.users.findOne({username: username, password: password}).then((result, err) => {;
  //   console.log('err', err);
  //   console.log('result', result);
  //   return result;
  // });
  return db.users.getOne({username: username, password: password}).then((result, err) => {;
    console.log('err', err);
    console.log('result', result);
    return result;
  });
});

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
  console.log('deserializeUser');
  try {
    const user = await fetchUser();
    done(null, user);
  } catch(err) {
    done(err);
  }
});

passport.use(new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' }, 
  (username, password, done) => {
    fetchUser(username, password)
    .then(user => {
      if(user){
        done(null, user);
      } else {
       done(null, false);
     }
    })
    .catch((err) => { done(err) });
  }));

const FacebookStrategy = require('passport-facebook').Strategy
passport.use(new FacebookStrategy({
  clientID: 'your-client-id',
  clientSecret: 'your-secret',
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
},
function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => done(null, user))
  }
  ))

const TwitterStrategy = require('passport-twitter').Strategy
passport.use(new TwitterStrategy({
  consumerKey: 'your-consumer-key',
  consumerSecret: 'your-secret',
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
},
function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => done(null, user))
  }
  ))

const GoogleStrategy = require('passport-google-auth').Strategy
passport.use(new GoogleStrategy({
  clientId: 'your-client-id',
  clientSecret: 'your-secret',
  callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
},
function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => done(null, user))
  }
  ))