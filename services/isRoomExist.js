const Room = require('../models/Room.js');

async function isRoomExist(room) {
    
    
    const exist = await Room.exists({room:room});
    console.log('exist:',exist,"room:", room);
    return exist;
    
}


module.exports = isRoomExist;