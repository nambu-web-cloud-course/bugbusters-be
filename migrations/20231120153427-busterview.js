'use strict';

const view_name = 'BusterReviewViews';
const query = `
SELECT busterid, 
count(
case when \`rev1\` = '1' or \`rev2\` = '1' or \`rev3\` = '1'
then 1 else null
end
) as revcode1,
count(
case when \`rev1\` = '2' or \`rev2\` = '2' or \`rev3\` = '2'
then 1 else null
end
) as revcode2,
count(
case when \`rev1\` = '3' or \`rev2\` = '3' or \`rev3\` = '3'
then 1 else null
end
) as revcode3,
count(
case when \`rev1\` = '4' or \`rev2\` = '4' or \`rev3\` = '4'
then 1 else null
end
) as revcode4,
count(
  case when \`rev1\` = '5' or \`rev2\` = '5' or \`rev3\` = '5'
  then 1 else null
  end
  ) as revcode5
  
From trades sub group by busterid
`
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE VIEW ${view_name} AS ${query}`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${view_name}`);
  }
};
