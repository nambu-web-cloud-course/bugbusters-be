
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

db.User = User;
db.Buster = Buster;

User.init(sequelize);
Buster.init(sequelize);


User.associate(db);
Buster.associate(db);

module.exports = db;
