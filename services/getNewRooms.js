const Room = require('../models/Room.js');

async function getNewRooms(userid, newroom) {
        
    if (newroom) {

        const rooms = await Room.find({userid:userid, user_visit:false});
        console.log('room:', rooms);

        return rooms;
    }
    
    // const rooms  = await Room.find();
    // return room;
}



module.exports = getNewRooms;