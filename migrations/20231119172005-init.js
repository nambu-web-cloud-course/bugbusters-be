'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

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
