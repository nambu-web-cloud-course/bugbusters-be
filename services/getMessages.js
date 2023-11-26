const Message = require('../models/Message.js');

async function getMessages(room, no=100) {
    

    const message  = await Message.find({room:room}).limit(no).lean();
    // console.log('getmessage:',JSON.stringify(message));
    return JSON.stringify(message);
}


module.exports = getMessages;