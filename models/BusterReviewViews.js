const Sequelize = require('sequelize');

class busterreviewviews extends Sequelize.Model {
    static init(sequelize) {
        return super.init( 
        { //테이블의 컬럼 정의
            busterid: { // busterid
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            revcode1: { // 리뷰1
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            revcode2: { // 리뷰2
                type: Sequelize.STRING(50),
                allowNull: false,
                defaultValue: 0
            },
            revcode3: { // 리뷰3
                type: Sequelize.STRING(50),
                allowNull: false,
                defaultValue: 0
            },
            revcode4: { // 리뷰4
                type: Sequelize.STRING(50),
                allowNull: false,
                defaultValue: 0
            },
            revcode5: { // 리뷰5
                type: Sequelize.STRING(50),
                allowNull: false,
                defaultValue: 0
            },
            

        },
        {
            sequelize,
            tableName: 'busterreviewviews', // Specify the view name
            timestamps: false, // If the view doesn't have timestamps
            readOnly: true // Make the view read-only in Sequelize
        });
    }
}
module.exports = busterreviewviews;