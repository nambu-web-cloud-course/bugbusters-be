
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  config
);



db.sequelize = sequelize;

const User = require('./User.js');
const Buster = require('./Buster.js');
const Request = require('./Request.js');
const Trade = require('./Trade.js');

db.User = User;
db.Buster = Buster;
db.Request = Request;
db.Trade = Trade;

User.init(sequelize);
Buster.init(sequelize);
Request.init(sequelize);
Trade.init(sequelize);


User.associate(db);
Buster.associate(db);
Request.associate(db);
Trade.associate(db);


module.exports = db;
