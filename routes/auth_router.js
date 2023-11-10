const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models'); 
const { Buster } = require('../models'); 
const router = express.Router();

const secret = process.env.JWT_SECRET || 'secret';
// console.log('secret;', secret);
// let users=[];

const create_hash = async (password, saltRound)=> {
    let hashed = await bcrypt.hash(password, saltRound);
    console.log(`${password} : ${hashed}`);
    return hashed;
};


router.post('/sign-up', async (req, res)=> {
    const new_user = req.body;
    // new_user.id = users.length+1;
    console.log('new_user:', new_user);
    new_user.password = await create_hash(new_user.password, 10);
    // console.log('hased:',new_user.password);

    try{
        const result = await User.create(new_user);
        // console.log('result', result);
        res.send ({success:true, userid:result.userid}) ;
    } catch (error ){
        res.send ({success:false, message:error, error:error});
    }
    // users.push(new_user);
    // console.log(users);
    // res.send({success:true});
    
})

router.post('/sign-in', async (req, res) => {
    const user = req.body;
    console.log('user', user);
    const options = {
        attributes: ['password'],
        where: {
            userid: user.userid
        },
    };
    // const result = users.find((u)=> u.user_id === user.user_id);
    const result = await User.findOne (options);
    console.log('signin result:', result);
    if (result) {
        const compared = await bcrypt.compare(user.password, result.password);
        console.log(`${user.password}: ${result.password}:${compared}`);
        if (compared) {
            const token = jwt.sign ({uid:user.userid, rol:'admin'}, secret);
            console.log('token:', token);
            res.send({success:true, userid:user.userid, token: token}); 
        } else {
            res.send ({success:false, message:"사용자가 없거나 비번이 잘못되었습니다. "});
        }
    } else {
        res.send ({success:false, message:"사용자가 없거나 비번이 잘못되었습니다. "});
    }
})

router.post('/buster', async (req, res) => {
    const new_buster = req.body;
    // console.log('buster:', new_buster);userid

    try{
        const result = await Buster.create(new_buster);
        // console.log('result:', result);
        if (result) {
            
            const userupdate =await User.update({usertype:'B'}, {where: {userid:result.userid}});
            console.log('userupdate:', userupdate);
        }
        // console.log('result', result);
        res.send ({success:true}) ;
    } catch (error ){
        res.send ({success:false, error:error});
    }
})

router.get('/', async (req, res)=> {
    const userid = req.query.userid;
    console.log('userid:', userid);
    const options = {
        include: [
            {
                model:User, 
                where: {
                    userid: userid,
                },
                // attributes: ['id', 'userid', 'content', 'created_at']
            }
        ]
    };
    if (userid) {
        
        // const filtered = posts.filter ((post)=>post.user_id === user_id);
        const result = await User.findOne({
            // attributes: ['user_id', 'user_name'],
            where: { userid: userid}
        });
        res.send({success:true, data: result});    
    }
    else {
    // console.log('post length', posts.length);
        const result = await User.findAll({
            // attributes:['id', 'userid', 'content', 'updated_at'],
            order:[['created_at', 'desc']]
        });
        res.send({success:true, data:result});
    }
})

router.get('/buster', async (req, res)=> {
    const userid = req.query.userid;
    console.log('userid:', userid);
    const options = {
        include: [
            {
                model:Buster, 
                where: {
                    userid: userid,
                },
                // attributes: ['id', 'userid', 'content', 'created_at']
            }
        ]
    };
    if (userid) {
        
        // const filtered = posts.filter ((post)=>post.user_id === user_id);
        const result = await Buster.findOne({
            // attributes: ['user_id', 'user_name'],
            where: { userid: userid}
        });
        if (result) {
            res.send({success:true, data: result});
        }
        else
            res.send({success:false, message:'해당 사용자의 정보가 없습니다.'})
        
    }
    else {
    // console.log('post length', posts.length);
        const result = await Buster.findAll({
            // attributes:['id', 'userid', 'content', 'updated_at'],
            order:[['created_at', 'desc']]
        });
        res.send({success:true, data:result});
    }
})
module.exports = router;