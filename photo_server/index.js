const Koa = require('koa');
const app = new Koa();

const {connect, initSchemas} = require('./init.js');
(async() =>{
	await connect();
	initSchemas();
})();

// 解决跨域问题(放在router下面也会造成跨域)
const cors = require('koa2-cors');
app.use(cors({
	origin: ['http://172.20.10.13:8080'],
	// origin: ['http://192.168.0.106:8080'],
	credentials: true
}));

// 解析前端post请求(放在router下面可能会造成解析不到post)
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// controller引入路由
const Router = require('koa-router');
// 加载集合user
let user = require('./controller/user.js');
let pic = require('./controller/pic.js');
let comment = require('./controller/comment.js');

let router = new Router();
router.use('/user', user.routes());
router.use('/pic', pic.routes());
router.use('/comment', comment.routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async ctx => {
	ctx.body = 'hello word';
});

app.listen(3000, ()=>{
	console.log('Server is running at port 3000...');
});