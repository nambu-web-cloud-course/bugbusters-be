const express = require('express');
const router = express.Router();
const { Code } = require('../models'); 
const { where, Op } = require('sequelize'); 

//post code 
router.post('/', async (req, res)=> {
    const code = req.body;
    // new_user.id = users.length+1;
    console.log('code:', code);
    // new_user.password = await create_hash(new_user.password, 10);
    // console.log('hased:',new_user.password);

    try{
        const result = await Code.create(code);
        // console.log('result', result);
        res.send ({success:true}) ;
    } catch (error ){
        res.send ({success:false, message:error, error:error});
    }

})

//get code by category
router.get('/:category', async (req, res)=> {
    const category = req.params.category;
    // console.log('category:', category);
    await Code.findAll({
        // attributes: ['id', 'userid', 'busterid', 'reqid', 'rev1', 'rev2', 'rev3', [Sequelize.literal('Request.state'),'state']],
        where: {category:category},
        order:[['id', 'asc']]
        
    }). then ((result)=> {
        if (result) {
            res.send({success:true, data: result}); 
        }
        else
            res.send({success:false, data: '입력한 category에 값이 없습니다.'});
    })
     
})

router.put('/:category/:keyid', async (req, res)=> {
    const keyid = req.params.keyid;
    const category = req.params.category;
    const content = req.body;


    try{
        await Code.update(content, {where:{category:category, keyid:keyid}})
        .then ((result) => {
            if (result > 0)
                res.send ({success:true}) ;
            else 
                res.send ({success:false, error:'해당 category에 keyid에 해당하는 값이 없습니다.'}) 
        });
        // console.log('result', result);
        
    } catch (error ){
        res.send ({success:false, message:error, error:error});
    }

})

router.delete('/:category/:keyid', async(req, res)=> {
    const keyid = req.params.keyid;
    const category = req.params.category;
    // posts = posts.filter((post)=>post.id !== +post_id);
    await Code.destroy({where:{category:category, keyid:keyid}})
    .then ((result)=> {
        if (result > 0) 
            res.send({success:true, data: result});
        else 
            res.send ({success:false, erroer:'입력한 category에 해당 keyid 값이 없습니디. '})
    });
    
})
module.exports = router;