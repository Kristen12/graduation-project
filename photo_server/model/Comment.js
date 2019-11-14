const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	commentId: mongoose.Schema.Types.ObjectId,
	picId: String,
	userId: String,
	commentText: String,
	date: String,
	userName: String,
	userHead: String,
	reComment: Array,
});

//发布模型
mongoose.model('Comment', commentSchema);