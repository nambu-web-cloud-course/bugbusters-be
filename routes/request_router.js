const express = require('express');

const router = express.Router();

const { User } = require('../models'); 
const { Request } = require('../models');
// const { Buster } = require('../models'); 


module.exports = router;

router.post('/', async (req, res)=> {
    const request = req.body;
    // new_user.id = users.length+1;
    console.log('request:', request);
    // new_user.password = await create_hash(new_user.password, 10);
    // console.log('hased:',new_user.password);

    try{
        const result = await Request.create(request);
        // console.log('result', result);
        res.send ({success:true}) ;
    } catch (error ){
        res.send ({success:false, message:error, error:error});
    }
    // users.push(new_user);
    // console.log(users);
    // res.send({success:true});
    
})

//get request list (all or by userid)
router.get('/', async (req, res)=> {
    
    const userid = req.query.userid;
    console.log('userid:', userid);
    const request = req.body;
    // new_user.id = users.length+1;
    console.log('request:', request);
    // new_user.password = await create_hash(new_user.password, 10);
    // console.log('hased:',new_user.password);

    // const options = {
    //     include: [
    //         {
    //             model:Request, 
    //             where: {
    //                 userid: userid,
    //             },
    //         }
    //     ]
    // };
    if (userid) {
        // const filtered = posts.filter ((post)=>post.user_id === user_id);
        const result = await Request.findAll({
            // attributes: ['userid', 'content', 'price', 'gender', 'addr1', 'addr2', 'sido', 'sigungu'],
            where: { userid: userid},
            order:[['id', 'desc']]
        });
        res.send({success:true, data: result});    
    }
    else {
    // console.log('post length', posts.length);
        const result = await Request.findAll({

            order:[['id', 'desc']]
        });
        res.send({success:true, data:result});
    }
    
})
