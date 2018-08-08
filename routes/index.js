const accountRouter = require('./account');
const productRouter = require('./product');
const combineRouters = require('koa-combine-routers');

module.exports = combineRouters(accountRouter, productRouter);