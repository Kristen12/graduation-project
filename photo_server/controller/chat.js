const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

router.post('/getMsgList', async ctx => {
	const Chat = mongoose.model('Chat');
    let newChat = new Chat(ctx.request.body);
    const user = newChat.from;
    const User = mongoose.model('User');
    let users = {}
    await User.find({}).exec().then(async(res)=>{
		res.forEach(v=>{
			users[v._id] = {name:v.userName,avatar:v.userHead}
        })
        await Chat.find({'$or':[{from:user},{to:user}]}).exec().then((res)=>{
            ctx.body = {
                code: 200,
                message: '成功',
                data: {
                    msgs:res,
                    users:users
                }
            };
        }).catch(err=>{
            ctx.body = {
                code: 500,
                message: err
            };
        });
	})
});
module.exports = router;