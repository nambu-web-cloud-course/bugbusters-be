let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// schema for chat room
const roomSchema = new Schema({
    room : { type: String, required: true },
    userid: { type: String, required: true },
    busterid: { type: String, required: true },
    reqid: {type:String, required:true},
    user_visit: {type:Boolean, required:true}   //whether user has visited or not
}, {timestamps: true});
module.exports = mongoose.model('room', roomSchema);