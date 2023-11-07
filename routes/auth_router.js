const express = require('express');

const router = express.Router();

router.post('/sign-up', async (req, res)=> {
    const new_user = req.body;
    // new_user.id = users.length+1;

    new_user.password = await create_hash(new_user.password, 10);
    // console.log('hased:',new_user.password);

    try{
        const result = await User.create(new_user);
        console.log('result', result);
        res.send ({success:true}) ;
    } catch (error ){
        res.send ({success:false, message:error, error:error});
    }
    // users.push(new_user);
    // console.log(users);
    // res.send({success:true});
    
})

module.exports = router;