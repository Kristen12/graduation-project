const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

// 上传图片
router.post('/uploadPic', async ctx=> {
	// 获取model
	const Pic = mongoose.model('Pic');
	// 接收post请求封装成Pic对象
	let newPic = new Pic(ctx.request.body);
	// 使用save保存图片
	await newPic.save().then(()=>{
		ctx.body = {
			code: 200,
			message: '成功'
		};
	}).catch(err=>{
		ctx.body = {
			code: 500,
			message: err
		};
	});
});

//获取图片集合
router.post('/showPic', async ctx=> {
	// 获取model
	const Pic = mongoose.model('Pic');
	await Pic.find({}).then((res)=>{
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

//根据Pid获取图片信息
router.post('/picInto', async ctx=> {
	// 获取model
	const Pic = mongoose.model('Pic');

	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const picid = ctx.request.body.picid;
	const picId = ObjectId(picid);

	await Pic.findOne({_id: picId}).exec().then((res)=>{
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

//根据Uid获取图片
router.post('/userPic', async ctx=> {
	// 获取model
	const Pic = mongoose.model('Pic');

	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	await Pic.find({userId: userId}).exec().then((res)=>{
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


// 根据pid删除照片
router.post('/deletePic', async ctx=> {
	// 获取model
	const Pic = mongoose.model('Pic');

	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const picid = ctx.request.body.picid;
	const picId = ObjectId(picid);

	// 获取model
	const User = mongoose.model('User');

	await Pic.remove({_id: picId}).exec().then(async(result)=>{

		await User.update({}, {$pull : {likeList: picId, collectList: picId}},{ multi: true }).exec().then((res)=>{
			
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

	})
});


//更新点赞展示like列表
router.post('/showLiked', async ctx=> {
	// 获取model
	const Pic = mongoose.model('Pic');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const picid = ctx.request.body.picid;
	const picId = ObjectId(picid);

	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	const userName = ctx.request.body.userName;

	const userHead = ctx.request.body.userHead;

	await Pic.update(
		{_id: picId}, {$push : {liked: {userId: userId, userName: userName, userHead: userHead}}}).exec().then((res)=>{
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

//更新点赞展示取消like列表
router.post('/showUnLiked', async ctx=> {
	// 获取model
	const Pic = mongoose.model('Pic');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const picid = ctx.request.body.picid;
	const picId = ObjectId(picid);

	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	const userName = ctx.request.body.userName;

	const userHead = ctx.request.body.userHead;

	await Pic.update({_id: picId}, {$pull: {liked: {userId: userId, userName: userName, userHead: userHead}}}, {multi: true}).exec().then((res)=>{
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