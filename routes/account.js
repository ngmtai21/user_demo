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
        accountController.signinPost)
    .get('/signup',
        accountController.signup)

module.exports = router;