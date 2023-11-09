const { sequelize } = require('./index.js');
const sync = ()=> {

    sequelize
        .sync({ force: false})
        .then(() => {
            console.log('데이터베이스 연결됨.');
        })
        .catch((err) => {
            console.error(err);
        });
}
module.exports = sync;