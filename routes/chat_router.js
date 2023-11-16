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


   module.exports = router;