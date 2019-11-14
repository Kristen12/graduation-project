const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

// 用户注册
router.post('/registUser', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 接收post请求封装成user对象
	let newUser = new User(ctx.request.body);
	// 使用save保存用户信息
	await newUser.save().then((res)=>{
		ctx.body = {
			code: 200,
			message: '注册成功',
			data: res
		};
	}).catch(err=>{
		ctx.body = {
			code: 500,
			message: err
		};
	});
});

// 用户登陆
router.post('/loginUser', async (ctx)=>{
	// 接收前端用户名密码数据
	let loginUser = ctx.request.body;
	let userName = loginUser.userName;
	let password = loginUser.password;
	// 引入model
	const User = mongoose.model('User');
	// 先查询用户名是否存在, 若存在再去比较密码
	await User.findOne({userName: userName}).exec().then(async (result)=>{
	 	if(result) {
	 		let newUser = new User();
	 		await newUser.comparePassword(password,result.password)
	 		.then(isMatch=>{
	 			if(isMatch) {
	 				ctx.body = {
	 					message: '登陆成功',
	 					code: 200,
	 					userInfo: {
	 						userName: result.userName,
	 						isLogin: true,
	 						userId: result._id,
	 					}
	 				}
	 			}
	 			else {
	 				ctx.body = {
	 					message: '登陆失败',
	 					code: 202,
	 				}
	 			}
	 		})
	 	}
	 	else {
	 		ctx.body = {
	 			message: '用户名不存在',
	 			code: 201,
	 		}
	 	}
	})
});

// 根据id获取用户信息
router.post('/userInto', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);
	await User.findOne({_id: userId}).exec().then((res)=>{
		ctx.body = {
			code: 200,
			message: '成功',
			data: {
				followList: res.followList,
				likeList: res.likeList,
				sex: res.sex,
				userHead: res.userHead,
				userName: res.userName,
				userid: res._id,
				collectList: res.collectList,
			}
		};
	}).catch(err=>{
		ctx.body = {
			code: 500,
			message: err
		};
	});
});

//更新like状态
router.post('/isLike', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	const picid = ctx.request.body.picid;
	const picId = ObjectId(picid);

	await User.update({_id: userId}, {$push : {likeList: picId}}).exec().then((res)=>{
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

router.post('/unLike', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	const picid = ctx.request.body.picid;
	const picId = ObjectId(picid);

	await User.update({_id: userId}, {$pull : {likeList: picId}}).exec().then((res)=>{
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


//更新collect状态
router.post('/isStar', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	const picid = ctx.request.body.picid;
	const picId = ObjectId(picid);

	await User.update({_id: userId}, {$push : {collectList: picId}}).exec().then((res)=>{
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

router.post('/unStar', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	const picid = ctx.request.body.picid;
	const picId = ObjectId(picid);

	await User.update({_id: userId}, {$pull : {collectList: picId}}).exec().then((res)=>{
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


//更新follow状态
router.post('/isFollow', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const myid = ctx.request.body.myid;
	const myId = ObjectId(myid);

	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	await User.update({_id: myId}, {$push : {followList: userId}}).exec().then((res)=>{
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

router.post('/unFollow', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const myid = ctx.request.body.myid;
	const myId = ObjectId(myid);

	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	await User.update({_id: myId}, {$pull : {followList: userId}}).exec().then((res)=>{
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

// 更改头像
router.post('/userHead', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	const userhead = ctx.request.body.userhead;

	await User.update({_id: userId}, {$set : {userHead: userhead}}).exec().then((res)=>{
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

// 更改性别
router.post('/userSex', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	const usersex = ctx.request.body.usersex;

	await User.update({_id: userId}, {$set : {sex: usersex}}).exec().then((res)=>{
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


// 根据id获取用户信息
router.post('/followedNum', async ctx=> {
	// 获取model
	const User = mongoose.model('User');
	// 根据_id的获取方法, 需要转变类型
	const ObjectId = require('mongodb').ObjectId;
	const userid = ctx.request.body.userid;
	const userId = ObjectId(userid);

	await User.find({ 'followList': userId}).exec().then((res)=>{
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