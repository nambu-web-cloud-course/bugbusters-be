const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Room = require('../models/Room');

const router = express.Router();

router.get('/', async (req, res) => {

    const userid = req.query.userid;
    const busterid = req.query.busterid;
    const reqid = req.query.reqid;

    let query='';
    // console.log('userid:', userid);
    if (userid!==undefined){
        query = {userid:userid};
    }
    else if  (busterid!==undefined) 
        query = {busterid:busterid};
    else
        query = {reqid:reqid};

    try{
        const room = await Room.find(query).lean();

        res.send({success:true, data:room});
        // res.json(room);
        
    } catch (err) {
        res.send({success:false, error:err});
        // res.send(err);
    }
    
})

// get the number of rooms that user didn't visit yet
router.get('/new', async (req, res) => {

    const userid = req.query.userid;

    let query={userid:userid, user_visit:false};
    // console.log('query:', query);
    try{
        // const room = await Room.find(query).lean();
        const count = await Room.find(query).count();
        // console.log('room:', count);

        res.send({success:true, data:count});
        // res.json(room);
        
    } catch (err) {
        console.log('err:', err);
        res.send({success:false, error:err});
        
        // res.send(err);
    }

})


module.exports = router;