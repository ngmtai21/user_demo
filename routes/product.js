const Router = require('koa-router');
const router = new Router({prefix: '/product'});
// const router = require('koa-router')({prefix: '/product'});
const productControllers = require('../controllers').products;

router
    .get('/', productControllers.getList);

module.exports = router;