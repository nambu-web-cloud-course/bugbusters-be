const getJson = require("serpapi");



async function imageSearch(req, res, next) {
    
  const params = req.params;
  console.log('params:', params)
  try {
    const data = await getJson({
    api_key: API_KEY,
    engine: "google_lens",
    url: "https://i.imgur.com/HBrB8p0.png"
    });

    console.log(data);
    res.locals.result = data;
    res.status(200);
  } catch (error) {
    console.log(error)
    res.status(400);
  }
  next();
}
module.exports = imageSearch;
