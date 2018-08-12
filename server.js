'use strict';

const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const path = require('path');
const serve = require('koa-static');
const render = require('./lib/render');
const passport = require('koa-passport');
const router = require('./routes');
const mongoose = require('mongoose');
const config = require('./config');
require('dotenv').config();

const app = new Koa();
app.proxy = true;
mongoose.connect(config.Connection.Mongo);
mongoose.connection.on('connected', (res) => {
    console.log('MongoDB connected!');
});
mongoose.connection.on('error', (err) => {
    console.log('MongoDB error', err);
});

app.use(serve(path.join(__dirname, 'public')));
app.use(logger());
app.use(render);

app.keys = ['aBc'];
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));
app.use(bodyParser());

require('./auth');
app.use(passport.initialize());
app.use(passport.session());

app.use(router());

app.on('error', (err, ctx) => {
    console.log('server error ', err);
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log('listening on port ' + port);


/**passport: https://github.com/mjhea0/koa-passport-example */