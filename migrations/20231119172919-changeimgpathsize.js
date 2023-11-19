'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'Buster',
      'profile',
      {
        type: Sequelize.STRING(150),
        allowNull: false,
      }
    );
    queryInterface.changeColumn(
      'Image',
      'img',
      {
        type: Sequelize.STRING(150),
        allowNull: false,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
