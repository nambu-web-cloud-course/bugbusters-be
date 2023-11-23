const express = require('express');
const router = express.Router();
const { Buster, Trade } = require('../models'); 
const { busterreviewviews } = require("../models");
const sequelize = require('sequelize'); 


// to get best 3 busters who have highest trade count 
router.get('/', async (req, res) => {
  
    const result = await Buster.findAll({
      attributes: [
        'id','userid','profile','selfintro','tech','exp','fav','accbank','accno',
        [sequelize.fn('COUNT', sequelize.col('Trades.id')), 'tradecount'] // Count the number of posts for each user
      ],
      include: [{
        model: Trade,
        attributes: [], // Fetch only the count without including Post attributes in the result
        where: {state:'CP'}
      }],
      group: ['Buster.userid'],
      order: [["tradecount", "desc"]],
      
    
  
  }).then ((result)=> {
        result = result.slice(0,3);
        res.send({ success: true, data: result });
  }).catch((err)=> {
        console.log('err:', err);
        res.send({ success: false, message: err, error: err });
  })
  
  
})

// to get best 3 busters who have highest review counts
// with review parameter, to get best 3 busters who have highest review counts for each review 
router.get("/review", async (req, res) => {
    const review = req.query.review
    const revcode = 'revcode'+ review;
    const condition = revcode + ': { [Op.ne]: null }';

    if (review === undefined || review === null || review === '') {

        const result = await busterreviewviews.findAll({
            attributes:['busterid', [sequelize.literal('revcode1 + revcode2 + revcode3 + revcode4 + revcode5'), 'totalReview']],
            order: [["totalReview", "desc"]],
            limit: 3,
        }).then ((result)=> {
                res.send({ success: true, data: result });
        }).catch((err)=> {
                console.log('err:', err);
                res.send({ success: false, message: err, error: err });
        })
  
    } else {
      const where = { condition };
      console.log('where:', where);

      const result = await busterreviewviews.findAll({
        attributes:['busterid', `${revcode}` ],
        order: [[`${revcode}`, "desc"]],
        limit: 3
      }).then ((result)=> {
                
                res.send({ success: true, data: result });
      }).catch((err)=> {
                console.log('err:', err);
                res.send({ success: false, message: err, error: err });
      })
    }
})

module.exports = router;