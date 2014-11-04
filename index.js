var koa = require('koa');
var app = koa();
var router = require('koa-router');
var mount = require('koa-mount');
var logger = require('koa-logger');
var limit = require('koa-better-ratelimit');
var api = require('./api/api.js');

var APIv1 = new router();
APIv1.get('/all', api.all);
APIv1.get('/single', api.single);

app.use(function *(next){
    try{
        yield next; //pass on the execution to downstream middlewares
    } catch (err) { //executed only when an error occurs & no other middleware responds to the request
        this.type = 'json'; //optional here
        this.status = err.status || 500;
        this.body = { 'error' : 'The application just went bonkers, hopefully NSA has all the logs ;) '};
        //delegate the error back to application
        this.app.emit('error', err, this);
    }
});

// rate limiting
app.use(limit({
    duration: 1000*60*3 , // 3 min
    max: 10,
    blacklist: []
}));

// logging
app.use(logger());

var handler = function *(next){
    this.type = 'json';
    this.status = 200;
    this.body = {'Welcome': 'This is a level 2 Hello World Application!!'};
};

app.use(mount('/v1', APIv1.middleware()));
if (!module.parent) app.listen(3000);
console.log('Hello World is Running on http://localhost:3000/');
