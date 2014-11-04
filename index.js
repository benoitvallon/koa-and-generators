var koa = require('koa');
var app = koa();
var router = require('koa-router');
var mount = require('koa-mount');
var api = require('./api/api.js');

var APIv1 = new router();
APIv1.get('/all', api.all);
APIv1.get('/single', api.single);

var handler = function *(next){
    this.type = 'json';
    this.status = 200;
    this.body = {'Welcome': 'This is a level 2 Hello World Application!!'};
};

app.use(mount('/v1', APIv1.middleware()));
if (!module.parent) app.listen(3000);
console.log('Hello World is Running on http://localhost:3000/');
