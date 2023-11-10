const Sequelize = require('sequelize');

class Buster extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            { //테이블의 컬럼 정의
                profile: { //프로필 사진 URL
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                selfintro: { //자기소개 
                    type:Sequelize.TEXT,
                    allowNull: false,
                },
                tech: { // 기술
                    type:Sequelize.STRING(20),
                    allowNull: false,
                },
                exp: { // 경험
                    type:Sequelize.TEXT,          
                    allowNull: false,
                },
                fav: { // 잘 잡는 벌레
                    type:Sequelize.STRING(20),      
                    allowNull: false,
                },
                accbank: { // 계좌은행
                    type:Sequelize.STRING(15),         
                    allowNull: false,
                },
                accno: { // 계좌번호
                    type:Sequelize.STRING(20),     
                    allowNull: false,
                },

            },
            {
                sequelize,
                timestamps: true, // true 이면 createdAt, updatedAt 컬럼 자동 추가
                underscored: true, // 테이블명과 컬럼명을 camelCase, snake_case 선택
                modelName: 'Buster', // 모델이름
                tableName: 'busters', // 테이블이름
                paranoid: true, // true이면 deletedAt컬럼이 자동으로 생성되고 삭제시 삭제하지 않음
                charset: 'utf8', // 인코딩, utf8mb : 이모지 포함
                collate: 'utf8_general_ci', // 정렬시 비교기준
            }
        );
    }
    static associate(db){
        //테이블간 관계를 정의
        // db.Buster.belongsTo(db.User, {foreignKey:'user_userid', sourceKey:'userid'});
        db.Buster.belongsTo(db.User, {foreignKey:{name:'userid', allowNull:false, unique:true}, sourceKey:'userid', });
    }
}
module.exports = Buster;