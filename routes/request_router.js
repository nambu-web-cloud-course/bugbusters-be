const express = require('express');

const router = express.Router();

const { Trade } = require('../models'); 
const { Request } = require('../models');
const { where, Op } = require('sequelize');
const { Image } = require('../models'); 

// create request
router.post('/', async (req, res)=> {
    const request = req.body;
    const images = req.body.profile;
    // new_user.id = users.length+1;
    console.log('images:', images);
    // new_user.password = await create_hash(new_user.password, 10);
    // console.log('hased:',new_user.password);

    try{
        const result = await Request.create(request);
        
        console.log('result', result.id, 'userid:', result.userid);
        
        if (images) {
            images.map(async (image, index) => {
                console.log('img',index, ':', image )
                await Image.create({img:image, reqid:result.id });
            });
        }
        // const img_result = await Image.create();
        res.send ({success:true}) ;
    } catch (error ){
        res.send ({success:false, message:error, error:error});
    }
    // users.push(new_user);
    // console.log(users);
    // res.send({success:true});
    
});

// modify request by id 
// ( if state of request is changed(only to CA) and there's any related trades, 
// the stae of related trade will be updated (ex. PR(in progress)->CA(cancel)))
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const content = req.body;
    
    try {
        const result = await Request.update(content, {where: {id: id} });
        if (result > 0) {
            console.log('result:', result);
            
            if (content.state && (content.state == 'CA'))
            {
                console.log('state 변경:', content.state, 'id:', id);

                Trade.update(
                    {state:content.state}, 
                    {where: {reqid:id},
                })
                .then ((updateResult)=> {
                    console.log('request:', updateResult);
                    
                });
            }
            res.send ({succss:true});
        }
        else 
            res.send({success:false,error: 'id에 해당하는 request가 없습니다.'})
        
    } catch (err) {
        res.send ({success:false, message:err, error:err});
    }
    
});


router.get('/:id', async (req, res) => {

    const reqid = req.params.id;

    const result = await Request.findOne({
        // attributes: ['userid', 'content', 'price', 'gender', 'addr1', 'addr2', 'sido', 'sigungu'],
        where: {id:reqid},
        order:[['id', 'desc']], 
        include: {
            model:Image,
            order:[['id', 'asc']]
            } 
    });
    res.send({success:true, data: result});
})
//get request list (all or by userid)
router.get('/', async (req, res)=> {
    
    const userid = req.query.userid;
    const sigungu = req.query.sigungu;
    const gender = req.query.gender;
    const price = req.query.price;  // price: 1, 2, 3, 4, 5

    var whereStatement = {};
    
    // 사용자가 자신의 요청을 조회하는 경우
    if (userid) {
        // const filtered = posts.filter ((post)=>post.user_id === user_id);
        whereStatement.userid = userid;
    }
    // 버스터가 조건을 주어 요청을 조회하는 경우
    else if (sigungu || gender || price) {
        
        if (sigungu)
            whereStatement.sigungu = sigungu;
        if (gender && gender !='A')
            whereStatement.gender = gender;
        if (price) {
        
            
            let pr1 = 0, pr2 = 0;
            if (price in ['1','2','3','4']){
            
                pr1 = parseInt(price) * 10000;
                
                pr2 = pr1 + 10000-1;
                console.log('pr1;',pr1, 'pr2:', pr2);
                whereStatement.price= {[Op.between]: [pr1, pr2]};
            }
            else {     
                pr1 = +price*10000;
                whereStatement.price = {[Op.gte]: pr1};
            }
            
        }
    };
        

    const result = await Request.findAll({
        // attributes: ['userid', 'content', 'price', 'gender', 'addr1', 'addr2', 'sido', 'sigungu'],
        where: whereStatement,
        order:[['id', 'desc']], 
        include: {
            model:Image,
            order:[['id', 'asc']]
            } 
    });
    res.send({success:true, data: result});
    
})


module.exports = router;