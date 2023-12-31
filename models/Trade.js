const Sequelize = require('sequelize');

class Trade extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            { //테이블의 컬럼 정의
                finalprice: { //최종가격
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                rev1: { //리뷰1 
                    type:Sequelize.CHAR(1),
                    allowNull: true,
                    // defaultValue:'0'
                },
                rev2: { // 리뷰2
                    type:Sequelize.CHAR(1),
                    allowNull: true,
                    // defaultValue:'0'
                },
                rev3: { // 리뷰3
                    type:Sequelize.CHAR(1),      
                    allowNull: true,
                    // defaultValue:'0'
                },
                state: { // 상태값: 진행중(PR),결제 요청중(AP), 결제 완료(PC),  취소(CA), 완료(CP)
                    type:Sequelize.CHAR(2),
                    allowNull:false,
                    defaultValue:'PR'
                }
            },
            {
                sequelize,
                timestamps: true, // true 이면 createdAt, updatedAt 컬럼 자동 추가
                underscored: true, // 테이블명과 컬럼명을 camelCase, snake_case 선택
                modelName: 'Trade', // 모델이름
                tableName: 'trades', // 테이블이름
                paranoid: true, // true이면 deletedAt컬럼이 자동으로 생성되고 삭제시 삭제하지 않음
                charset: 'utf8', // 인코딩, utf8mb : 이모지 포함
                collate: 'utf8_general_ci', // 정렬시 비교기준
            }
        );
    }
    static associate(db){
        //테이블간 관계를 정의
        // db.Buster.belongsTo(db.User, {foreignKey:'user_userid', sourceKey:'userid'});
        db.Trade.belongsTo(db.User, {foreignKey:{name:'userid', allowNull:false}, sourceKey:'userid' });
        db.Trade.belongsTo(db.Buster, {foreignKey:{name:'busterid', allowNull:false}, sourceKey:'userid' });
        db.Trade.belongsTo(db.Request, {foreignKey:{name:'reqid', allowNull:false}, sourceKey:'id' });

    }
}
module.exports = Trade;