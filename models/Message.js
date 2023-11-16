let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const msgSchema = new Schema({
    message : { type: String, required: true },
    userid: { type: String, required: true },
    room: { type: String, required: true },
    
}, {timestamps: true});

module.exports = mongoose.model('message', msgSchema);

