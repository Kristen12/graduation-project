const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const picSchema = new Schema({
	picId: mongoose.Schema.Types.ObjectId,
	picContent: String,
	picText: String,
	userId: String,
	liked: Array,//记录给该图片点赞用户id
});

//发布模型
mongoose.model('Pic', picSchema);