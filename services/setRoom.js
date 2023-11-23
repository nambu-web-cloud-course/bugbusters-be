
const isRoomExist = require("./isRoomExist.js");
const Room = require('../models/Room.js');



async function setRoom(room, visitor) {
    console.log('🔴 setRoom:', room, visitor);

    //룸 정보에서 reqid, userid, busterid 알기 위해 분리
    //룸 : reqid_userid_busterid
    const roomarr = room.split("_");
    const reqid = roomarr[0];
    const userid = roomarr[1];
    const busterid = roomarr[2];
    
    const user_visit = userid == visitor?  true :  false; 

    //db에 동일한 방이 없을 때만 db에 저장
    isRoomExist(room)
      .then((response) => {
        // console.log('isRoomExist:', response);
        if (!response)  { 

            console.log('🔴 방이 없어서 저장합니다.')
            const rm = new Room(
                {room:room, userid:userid, busterid:busterid, reqid:reqid, user_visit:user_visit});
            rm.save();
            }   
        else if (user_visit) {  // 방은 이미 있음, 무서버가 join했을 때 user_visit을 true로 바꿔줌
            const filter = { room: room };
            // console.log('filter:', filter);
            const update = { user_visit: true };
            // console.log('rook:', Room.findOne(filter).lean());
            
            Room.findOneAndUpdate( filter, {$set:update}, { new:true })
            .then((doc)=> {
                // console.log('room:', doc.room, 'doc:', doc.user_visit);
            }).catch ((err)=> {
                console.log('err', err);
            });
            
        }   
        
      })
      .catch((err) => console.log(err));

    
}



module.exports = setRoom;