const Koa = require('koa');
const app = new Koa();

const {connect, initSchemas} = require('./init.js');
(async() =>{
	await connect();
	initSchemas();
})();

// 关联koa
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);

// const mongoose = require('mongoose');
// const Chat = mongoose.model('Chat');
const chatModel = require('./model/Chat');
const Chat = chatModel.getModel('Chat');

io.on('connection',function(socket){
	// 传进来的socket变量为当前本次链接，而io是全局链接
	console.log('socket connection');
	socket.on('sendmsg', function(data){
		const {from,to,msg} = data;
		// 两个用户id排序变成字符串每次查询这个字符串
		const chatid = [from,to].sort().join('_')
		Chat.create({chatid,from,to,content:msg},function(err,doc){
			console.log(doc,"创建消息");
			io.emit('recvmsg',Object.assign({},doc._doc))
		})
	})
})


// 解决跨域问题(放在router下面也会造成跨域)
const cors = require('koa2-cors');
app.use(cors({
	origin: ['http://12.23.26.67:8080'],
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
let chat = require('./controller/chat.js');

let router = new Router();
router.use('/user', user.routes());
router.use('/pic', pic.routes());
router.use('/comment', comment.routes());
router.use('/chat', chat.routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async ctx => {
	ctx.body = 'hello word';
});

// "listener" argument must be a function
server.listen(3000, ()=>{
	console.log('Server is running at port 3000...');
});