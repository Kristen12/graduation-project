const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatid:{'type':String,'require':true},
    from: {'type':String, 'require':true},
    to: {'type':String, 'require':true},
    read: {'type':Boolean, default:false},
    content: {'type':String, 'require':true, default:''},
    create_time: {'type':Number, default:new Date().getTime()}
});

mongoose.model('Chat', chatSchema);

module.exports = {
	getModel:function(name){
		return mongoose.model(name)
	}
}