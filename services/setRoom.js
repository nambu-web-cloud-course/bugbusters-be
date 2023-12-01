
const isRoomExist = require("./isRoomExist.js");
const getNewRoomsCount = require("./getNewRoomsCount.js");
const saveMessage = require("./saveMessage.js");
const Room = require('../models/Room.js');
// Chat Setting
const BUSTER_BOT = "BugBusters_Official";

async function setRoom(room, visitor, io) {
    console.log('🔴 setRoom:', room, visitor);

    //룸 정보에서 reqid, userid, busterid 알기 위해 분리
    //룸 : reqid_userid_busterid
    const roomarr = room.split("_");
    const reqid = roomarr[0];
    const userid = roomarr[1];
    const busterid = roomarr[2];
    
    const user_visit = userid == visitor?  true :  false; 
    // io.emit("newroom", {userid:'test', newroom_cnt:3}) 
    //db에 동일한 방이 없을 때만 db에 저장
    isRoomExist(room)
      .then((response) => {
        // console.log('isRoomExist:', response);
        if (!response)  { 

            console.log('🔴 방이 없어서 저장합니다.')
            const rm = new Room(
                {room:room, userid:userid, busterid:busterid, reqid:reqid, user_visit:user_visit});
            rm.save();
            
            Room.find({userid:userid, user_visit:false}).count()
            .then((newroom_cnt)=> {
                // console.log('newroom_cnt:', newroom_cnt, 'userid:', userid);
                io.emit("newroom", {userid:userid, newroom_cnt: newroom_cnt});
            });
            
            const createdAt = Date.now();
            // Buster entering message
            const busterEnteringMessage = {
                message: `${busterid}님이 채팅방에 접속했습니다.`,
                userid: BUSTER_BOT,
                createdAt,
            };
            io.to(room).emit("receive_message", busterEnteringMessage);
            saveMessage(busterEnteringMessage.message, busterEnteringMessage.userid, room)
                .then((response) => console.log("receive_message:", response))
                .catch((err) => console.log(err));
        }   
        else 
        {
            Room.findOne({room:room}).lean()
            .then((doc)=> {
                if (!doc.user_visit && user_visit) { // 방은 이미 있음, 무서버가 join했을 때 user_visit을 true로 바꿔줌


            
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
                    
                    //User entering message
                    const createdAt = Date.now();
                    const userEnteringMessage = {
                        message: `${userid}님이 채팅방에 접속했습니다.`,
                        userid: BUSTER_BOT,
                        createdAt,
                    };
                    io.to(room).emit("receive_message",userEnteringMessage);
                    
                    saveMessage(userEnteringMessage.message, userEnteringMessage.userid, room)
                    .then((response) => console.log("receive_message:", response))
                    .catch((err) => console.log(err));

                    Room.find({userid:userid, user_visit:false}).count()
                    .then((newroom_cnt)=> {
                        // console.log('newroom_cnt:', newroom_cnt, 'userid:', userid);
                        io.emit("newroom", {userid:userid, newroom_cnt: newroom_cnt});
                    });
                }
            })
        }   
        
      })
      .catch((err) => console.log(err));

    
}



module.exports = setRoom;