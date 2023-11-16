

const Message = require('../models/Message.js');

async function saveMessage(message, userid, room) {
    
    const msg = new Message(
        {message:message, userid:userid, room:room});
    await msg.save();
  
}
module.exports = saveMessage;