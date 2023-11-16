let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const roomSchema = new Schema({
    room : { type: String, required: true },
    userid: { type: String, required: true },
    busterid: { type: String, required: true },
    reqid: {type:String, required:true}
}, {timestamps: true});
module.exports = mongoose.model('room', roomSchema);