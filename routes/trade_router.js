const express = require("express");

const router = express.Router();

const { User } = require("../models");
const { Request } = require("../models");
const { Trade } = require("../models");
const { Sequelize } = require("sequelize");
// const { Buster } = require('../models');

module.exports = router;

router.post("/", async (req, res) => {
  const trade = req.body;
  // new_user.id = users.length+1;
  console.log("request:", trade);
  // new_user.password = await create_hash(new_user.password, 10);
  // console.log('hased:',new_user.password);

  try {
    const result = await Trade.create(trade);
    // console.log('result', result);
    res.send({ success: true });
  } catch (error) {
    res.send({ success: false, message: error, error: error });
  }
});

// modify trade by id ( if state of trade is changed(only to CP), the stae of related request will be updated )
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const content = req.body;

  try {
    if (id) {
      const result = await Trade.update(content, { where: { id: id } });
      if (result > 0) {
        // console.log('result:', result);
        if (content.state && content.state == "CP") {
          // if (content.state && (content.state == 'CA' || content.state == 'CP'))
          // console.log('state 변경:', content.state, 'id:', id);
          Trade.findOne({
            where: { id: id },
            include: [
              {
                model: Request,
              },
            ],
          }).then((resultRequest) => {
            // console.log('request:', resultRequest.Request);
            // const reqid = resultRequest.Request.id;
            resultRequest.Request.update({ state: content.state })
              // Trade.update({state:content.state},{where:{id:reqid}})
              .then((updateResult) => {
                // console.log('result:', updateResult)
              });
          });
        }
        res.send({ succss: true });
      } else
        res.send({ success: false, error: "id에 해당하는 trade가 없습니다." });
    } else res.send({ success: false, error: "id값이 없습니다." });
  } catch (err) {
    res.send({ success: false, message: err, error: err });
  }
});

//get a trade by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  // console.log('id:', id)
  await Trade.findOne({
    // attributes: ['id', 'userid', 'busterid', 'reqid', 'rev1', 'rev2', 'rev3', [Sequelize.literal('Request.state'),'state']],
    where: { id: id },
    order: [["id", "desc"]],
  }).then((result) => {
    if (result) res.send({ success: true, data: result });
    else res.send({ success: false, error: "id에 해당하는 trade가 없습니다." });
  });
});

//get trade list (all or by userid/ busterid/ reqid)
router.get("/", async (req, res) => {
  const reqid = req.query.reqid;
  const userid = req.query.userid;
  const busterid = req.query.busterid;

  var whereStatement = {};

  if (userid) {
    whereStatement.userid = userid;
  } else if (busterid) {
    whereStatement.busterid = busterid;
  } else if (reqid) {
    whereStatement.reqid = reqid;
  }
  const result = await Trade.findAll({
    // attributes: ['id', 'userid', 'busterid', 'reqid', 'rev1', 'rev2', 'rev3', [Sequelize.literal('Request.state'),'state']],
    where: whereStatement,
    order: [["id", "desc"]],
  });
  res.send({ success: true, data: result });
});
