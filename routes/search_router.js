const express = require('express');
const {getJson} = require("serpapi");
// const {imageSearch } = require('../services/imageSearch.js');
const API_KEY = process.env.SERPAPI_KEY;
const router = express.Router();

router.post("/",  async (req, res) => {

    // const userid = req.query.userid;
    const image = req.query.image;
    console.log('image:', image);
    try {
        const data = await getJson({
        api_key: API_KEY,
        engine: "google_lens",
        hl:"ko",
        country:"KR",
        url: image

        });
    
        console.log(data.knowledge_graph);
        res.locals.result = data.knowledge_graph;
        res.status(200).json(res.locals.result);
      } catch (error) {
        console.log(error)
        res.status(400);
      }
    // res.status(200).json(res.locals.result);
  });


module.exports = router;