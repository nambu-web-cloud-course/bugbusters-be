

const Room = require('../models/Room.js');

async function setRoom(room, userid, busterid,reqid) {
    
    const rm = new Room(
        {room:room, userid:userid, busterid:busterid, reqid:reqid});
    await rm.save();
  
}
module.exports = setRoom;