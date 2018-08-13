const passport = require('koa-passport');
const returnModel = require('../models/returnModel');
const config = require('../config');
const entities = require('../models/entities');
const helpers = require('../helpers');
const db = require('../db');

const getList = (ctx, next) => {
    ctx.body = 'Get list users';
};

const checkLogin = async (ctx) => {

};

const signin = async (ctx) => {
    await ctx.render('account/signin', returnModel.loginModel('test', '', ''));
};

const logout = (ctx) => {
    ctx.logout();
    ctx.redirect('/');
};

const validateSignin = async (ctx, next) => {
    const params = ctx.request.body;

    if (params) {
        let username = params.username;
        let password = params.password;
        if (!username || username.trim() == '') {
            await ctx.render('account/signin', returnModel.loginModel('', 'username', 'Input username'));
            return;
        }
        username = username.trim();
        let length = username.length;
        if (length > 30) {
            await ctx.render('account/signin', returnModel.loginModel(username, 'username', 'length of username less than 30.'));
            return;
        }

        if (!password || password.trim() == '') {
            await ctx.render('account/signin', returnModel.loginModel(username, 'password', 'Input password'))
            return;
        }
        password = password.trim();
        length = password.length;

        if (length > 30) {
            await ctx.render('account/signin', returnModel.loginModel(username, 'password', 'length of password less than 30.'));
            return;
        }

        return next();
    } else {
        ctx.render('account/signin', {})
    }
};

const signinPost = (ctx, next) => {
    return passport.authenticate('local', {session: false}, (error, user) => {
        if (!user) {
            ctx.state.error = {
                message: 'username or password wrong', 
                invalidLoginCount: (config.Login.maxFailedLogin - 1) || 0
            };
        } else {
            ctx.state.error.invalidLoginCount = config.Login.maxFailedLogin;
            ctx.state.user = user;

            let userSession = Object.assign(user.toJSON(), {
                salt: undefined,
                encryptedPassword: undefined,
                pincode: undefined
            });

            ctx.session.user = userSession;
        }
    })(ctx, next).then(() => {
        if (ctx.state.user) {
            ctx.signin = {
                error: {},
                redirect: '/account'
            }
        } else {
            if(ctx.state.error.invalidLoginCount) { 
                let maxFailedLogin = config.Login.maxFailedLogin;
                let remaining = (maxFailedLogin - ctx.state.error.invalidLoginCount);
                // ctx.body = entities.base({remaining: remaining, max: maxFailedLogin}, ctx.state.error.message || 'Bad Request', 0);
                ctx.signin = {
                    error: returnModel.loginModel(ctx.request.body.username, '', ctx.state.error.message),
                    redirect: 'account/signin'
                }

            } else {
                // ctx.throw(400, ctx.state.error.message || 'Bad Request');
                ctx.signin = {
                    error: returnModel.loginModel(ctx.request.body.username, '', ctx.state.error.message),
                    redirect: 'account/signin'
                }
            }
        }

        return next();
    });

};

const signinComplete = async (ctx) => {
    if(ctx.signin.error){
        await ctx.render('account/signin', ctx.signin.error);
    } else {
        await ctx.render('account');
    }
};

const signup = async (ctx) => {
    await ctx.render('account/signup', returnModel.signupModel('', '','', ''));
};

const validateSignup = async (ctx, next) => {
    const params = ctx.request.body;

    if (params) {
        let username = params.username;
        let email = params.email;
        let password = params.password;
        let confirmPassword = params['confirm-password'];

        if (!username || username.trim() == '') {
            await ctx.render('account/signup', returnModel.signupModel('', email, 'username', 'Input username'));
            return;
        }
        username = username.trim();
        let length = username.length;
        if (length > 30) {
            await ctx.render('account/signup', returnModel.signupModel(username, email, 'username', 'length of username less than 30.'));
            return;
        }

        if (!email || email.trim() == '') {
            await ctx.render('account/signup', returnModel.signupModel(username, '', 'email', 'Input email'));
            return;
        }
        email = email.trim();
        if(!helpers.validate.validateEmail(email)){
            await ctx.render('account/signup', returnModel.signupModel(username, email, 'email', 'email invalid'));
            return;   
        }

        if (!password || password.trim() == '') {
            await ctx.render('account/signup', returnModel.signupModel(username, email, 'password', 'Input password'))
            return;
        }
        password = password.trim();
        
        if (password != confirmPassword) {
            await ctx.render('account/signup', returnModel.signupModel(username, email, 'confirm-password', 'confirm-password not match.'))
            return;
        }

        ctx.state.user = {
            username,
            email,
            password: helpers.encrypt.md5(password)
        };

        return next();
    } else {
        ctx.render('account/signup', {})
    }
};

const signupPost = (ctx, next) => {
    const obj = ctx.state.user;
    console.log('-----------obj', obj);
    const user = new db.users(obj);
    user.save()
        .then((res) => {
            console.log('-------------signupPost - res', res);
        });
};

const signupComplete = async (ctx) => {

};

module.exports = {
    getList: getList,
    logout: logout,
    signin: signin,
    signup: signup,
    validateSignin: validateSignin,
    signinPost: signinPost,
    signinComplete,
    validateSignup,
    signupPost,
    signupComplete
};