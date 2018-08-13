const Router = require('koa-router');
const router = new Router({ prefix: '/account' });
const accountController = require('../controllers').account;

router
    .get('/',
        accountController.getList)
    .get('/logout',
        accountController.logout)
    .get('/signin',
        accountController.signin)
    .post('/signin',
        accountController.validateSignin,
        accountController.signinPost,
        accountController.signinComplete)
    .get('/signup',
        accountController.signup)
    .post('/signup',
        accountController.validateSignup,
        accountController.signupPost,
        accountController.signupComplete)

module.exports = router;