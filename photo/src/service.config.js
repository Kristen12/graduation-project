const SERVERURL = 'http://12.23.26.67:3000/';

const URL = {
	// 注册
	registUser: SERVERURL + 'user/registUser',
	// 登陆
	loginUser: SERVERURL + 'user/loginUser',
	// 上传照片
	uploadPic: SERVERURL + 'pic/uploadPic',
	// 首页展示照片（显示照片集合）
	showPic: SERVERURL + 'pic/showPic',
	// 详情页展示详情(根据pid查看照片详情)
	picInto: SERVERURL + 'pic/picInto',
	// 展示用户具体信息
	userInto: SERVERURL + 'user/userInto',
	// 用户点赞状态
	isLike: SERVERURL + 'user/isLike',
	unLike: SERVERURL + 'user/unLike',
	// 主页图片显示(根据uid查找照片)
	userPic: SERVERURL + 'pic/userPic',
	// 用户关注状态
	isFollow: SERVERURL + 'user/isFollow',
	unFollow: SERVERURL + 'user/unFollow',
	// 更改头像
	userHead: SERVERURL + 'user/userHead',
	// 更改性别
	userSex: SERVERURL + 'user/userSex',
	// 展示评论
	showComment: SERVERURL + 'comment/showComment',
	// 提交评论
	submitComment: SERVERURL + 'comment/submitComment',
	// 删除照片
	deletePic: SERVERURL + 'pic/deletePic',

	// 用户收藏状态
	isStar: SERVERURL + 'user/isStar',
	unStar: SERVERURL + 'user/unStar',

	//图片详情页底部展示点赞tab
	showLiked: SERVERURL + 'pic/showLiked',
	showUnLiked: SERVERURL + 'pic/showUnLiked',

	// 粉丝
	followedNum: SERVERURL + 'user/followedNum',
	
	// 聊天列表
	getMsgList: SERVERURL + 'chat/getMsgList',
};

export default URL;