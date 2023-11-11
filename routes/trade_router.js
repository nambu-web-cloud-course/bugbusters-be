const express = require('express');

const router = express.Router();

const { User } = require('../models'); 
const { Request } = require('../models');
const { Trade } = require('../models');
// const { Buster } = require('../models'); 


module.exports = router;

router.post('/', async (req, res)=> {
    const trade = req.body;
    // new_user.id = users.length+1;
    console.log('request:', trade);
    // new_user.password = await create_hash(new_user.password, 10);
    // console.log('hased:',new_user.password);

    try{
        const result = await Trade.create(trade);
        // console.log('result', result);
        res.send ({success:true}) ;
    } catch (error ){
        res.send ({success:false, message:error, error:error});
    }
    // users.push(new_user);
    // console.log(users);
    // res.send({success:true});
    
})

//get request list (all or by userid or by busterid)
router.get('/', async (req, res)=> {
    
    const userid = req.query.userid;
    const busterid = req.query.busterid;
    console.log('userid:', userid);
    console.log('busterid:', busterid);

    if (userid) {
        const result = await Trade.findAll({
            // attributes: ['user_id', 'user_name'],
            where: { userid: userid },
            order:[['id', 'desc']]
        });
        res.send({success:true, data: result});    
    }
    else if (busterid) {
        const result = await Trade.findAll({
            // attributes: ['user_id', 'user_name'],
            where: { busterid: busterid },
            order:[['id', 'desc']]
        });
        res.send({success:true, data: result});    
    }
    else {
        const result = await Trade.findAll({

            order:[['id', 'desc']]
        });
        res.send({success:true, data:result});
    }
    
})
