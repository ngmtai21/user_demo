const passport = require('koa-passport');
const returnModel = require('../models/returnModel');

const getList = (ctx, next) => {
    ctx.body = 'Get list users';
};

const checkLogin = async (ctx) => {

};

const signin = async (ctx) => {
    console.log('signin');
    // const user = ctx.session.user;
    // if (user) {
    //     await ctx.redirect('/account');
    // } else {
    //     await ctx.render('account/signin', {});
    // }
    await ctx.render('account/signin', returnModel.loginModel('test', '', ''));
};

const signup = async (ctx) => {
    await ctx.render('account/signup', returnModel.signupModel());
}

const logout = (ctx) => {
    ctx.logout();
    ctx.redirect('/');
};

const validateSignin = async (ctx, next) => {
    console.log('validateSignin');
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

const signinPost = ((ctx) => {
    console.log('signinPost');
    return passport.authenticate('local', {
        successRedirect: '/account',
        failureRedirect: '/account/signin'
    })
})();

module.exports = {
    getList: getList,
    logout: logout,
    signin: signin,
    signup: signup,
    validateSignin: validateSignin,
    signinPost: signinPost
};