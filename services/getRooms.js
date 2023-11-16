const Room = require('../models/Room.js');

async function getRooms() {
        
    const room  = await Room.find();
    return room;
}



module.exports = getRooms;