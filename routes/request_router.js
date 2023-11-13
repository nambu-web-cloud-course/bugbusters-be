const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
const router = express.Router();

const { User } = require('../models'); 
const { Request } = require('../models');
const { where, Op } = require('sequelize');
const { Image } = require('../models'); 

// const dir = 'uploads/';
// !fs.existsSync(dir)&& fs.mkdirSync(dir);

// var storage = multer.diskStorage({
    

//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   })
   
// var upload = multer({ storage: storage }).single("file")  



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
        
        images.map(async (image, index) => {
            console.log('img',index, ':', image )
            await Image.create({img:image, reqid:result.id });
        });
        // const img_result = await Image.create();
        res.send ({success:true}) ;
    } catch (error ){
        res.send ({success:false, message:error, error:error});
    }
    // users.push(new_user);
    // console.log(users);
    // res.send({success:true});
    
});


// router.post('/image',  (req, res) => {
//     upload(req, res, err =>{
//         if(err){
//             return res.json({success: false, err})
//         }
//         console.log('filename:', res.req.file.filename);
//         return res.json({success: true, filePath: res.req.file.path , fileName: res.req.file.filename})
//     })
// })

router.put('/:id', async (req, res) => {
    
    const id = parseInt(req.params.id);
    const content = req.body;
    console.log('id:', id);
    // console.log('content:', post.content);
    console.log('modified content:', content);
    // post.content = content;
    try {
        const result = await Request.update(content, {where: {id: id} })
        res.send ({succss:true});
    } catch (err) {
        res.send ({success:false, message:err, error:err});
    }
    
});

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
        order:[['id', 'desc']]
    });
    res.send({success:true, data: result});
    
})


module.exports = router;