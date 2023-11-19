const Room = require('../models/Room.js');

async function leaveRoom(userid, room) {

  const filter = { room: room };
  let update = '';
  await Room.findOne (filter).then ((rm) => {
    // console.log('userid',userid);
    if (rm){
      if (userid == rm.userid) { 
        update = { userid: null };
      }
      else if (userid == rm.busterid) {
      //   console.log('버스터 나갔나요?', userid);
        update = { busterid:null };
      }
    }
    else 
      return;
  });
  // console.log('update:', update);
  const rm_to_be_updated = await Room.findOneAndUpdate( filter, update, { new:true });
  // console.log(rm_to_be_updated);
  return;
}

module.exports = leaveRoom;
