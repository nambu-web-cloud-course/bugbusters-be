
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  config ,
  {logging: false}
);



db.sequelize = sequelize;

const User = require('./User.js');
const Buster = require('./Buster.js');
const Request = require('./Request.js');
const Trade = require('./Trade.js');
const Image = require('./Image.js');
const Code = require('./Code.js');

db.User = User;
db.Buster = Buster;
db.Request = Request;
db.Trade = Trade;
db.Image = Image;
db.Code = Code;

User.init(sequelize);
Buster.init(sequelize);
Request.init(sequelize);
Trade.init(sequelize);
Image.init(sequelize);
Code.init(sequelize);


User.associate(db);
Buster.associate(db);
Request.associate(db);
Trade.associate(db);
Image.associate(db);
Code.associate(db);


module.exports = db;
