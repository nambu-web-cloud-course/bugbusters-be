const Room = require('../models/Room.js');

async function getNewRoomsCount(userid) {
        
    let query={userid:userid, user_visit:false};
    console.log('query:', query);
    
    // if (userid) 
        await Room.find(query).count()
        .then((newroom_cnt)=> {
            console.log('count:', newroom_cnt);
            return newroom_cnt;
        }).catch((err)=> {
            console.log('err:', err);
            return 0;
        });
            
            
    // }
    
}



module.exports = getNewRoomsCount;