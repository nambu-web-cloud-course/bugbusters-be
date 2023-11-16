const Room = require('../models/Room.js');

async function leaveRoom(userid, room) {

  const filter = { room: room };
  let update = '';
  const rm = await Room.findOne (filter);

  if (userid == rm.userid)
    update = { userid: null };
  else (userid == rm.busterid)
    update = { busterid:null };
  // console.log('update:', update);
  const rm_to_be_updated = await Room.findOneAndUpdate( filter, update, { new:true });
  // console.log(rm_to_be_updated);
  return;
}

module.exports = leaveRoom;
