const express = require('express');

const router = express.Router();

const { User } = require('../models'); 
const { Request } = require('../models');
const { Trade } = require('../models');
const { Sequelize } = require('sequelize');
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

// modify trade by id
router.put('/:id', async (req, res) => {
    
    const id = parseInt(req.params.id);
    const content = req.body;  
    console.log('id:', id);
    // console.log('content:', post.content);
    console.log('modified content:', content);
    // post.content = content;
    try {
        if (id) {
            const result = await Trade.update(content, {where: {id: id} })
            res.send ({succss:true});
        }
        else 
            res.send({success:false, message:'id확인해 주세요.'});
    } catch (err) {
        res.send ({success:false, message:err, error:err});
    }
    
});

//get trade list (all or by userid or by busterid)
router.get('/', async (req, res)=> {
    
    const userid = req.query.userid;
    const busterid = req.query.busterid;
    console.log('userid:', userid);
    console.log('busterid:', busterid);

    var whereStatement = {};

    if (userid) {
        whereStatement.userid = userid;
           
    }
    else if (busterid) {
        whereStatement.busterid = busterid;  
    }
    
    const result = await Trade.findAll({
        // attributes: ['id', 'userid', 'busterid', 'reqid', 'rev1', 'rev2', 'rev3', [Sequelize.literal('Request.state'),'state']],
        where: whereStatement,
        // include: [
        //     {
        //         model:Request,
        //         // as: Request,
        //         attributes:[],
        //     }
        // ],
        // raw:true,
        order:[['id', 'desc']]
        
    });
    res.send({success:true, data: result}); 
})
