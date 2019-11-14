const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');


router.post('/submitComment', async ctx=> {
	// 获取model
	const Comment = mongoose.model('Comment');
	// 接收post请求封装成Pic对象
	let newComment = new Comment(ctx.request.body);
	// 使用save保存图片
	await newComment.save().then((res)=>{
		ctx.body = {
			code: 200,
			message: '成功',
			data: res,
		};
	}).catch(err=>{
		ctx.body = {
			code: 500,
			message: err
		};
	});
});


//根据Pid获取图片信息
router.post('/showComment', async ctx=> {
	// 获取model
	const Comment = mongoose.model('Comment');

	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const picid = ctx.request.body.picid;
	const picId = ObjectId(picid);

	await Comment.find({picId: picId}).exec().then((res)=>{
		ctx.body = {
			code: 200,
			message: '成功',
			data: res
		};
	}).catch(err=>{
		ctx.body = {
			code: 500,
			message: err
		};
	});
});


module.exports = router;