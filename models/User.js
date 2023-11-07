const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            { //테이블의 컬럼 정의
                userid: {
                    type: Sequelize.STRING(15),
                    allowNull: false,
                    unique: true,
                },
                name: {
                    type:Sequelize.STRING(10),
                    allowNull: false,
                },
                password: {
                    type:Sequelize.STRING(20),
                    allowNull: false,
                },
                gender: {
                    type:Sequelize.CHAR(1),     //M: 남자, F:여자
                    allowNull: false,
                },
                addr1: {
                    type:Sequelize.VARCHAR(50),     //M: 남자, F:여자
                    allowNull: false,
                },
                
            },
            {
                sequelize,
                timestamps: true, // true 이면 createdAt, updatedAt 컬럼 자동 추가
                underscored: true, // 테이블명과 컬럼명을 camelCase, snake_case 선택
                modelName: 'User', // 모델이름
                tableName: 'users', // 테이블이름
                paranoid: true, // true이면 deletedAt컬럼이 자동으로 생성되고 삭제시 삭제하지 않음
                charset: 'utf8', // 인코딩, utf8mb : 이모지 포함
                collate: 'utf8_general_ci', // 정렬시 비교기준
            }
        );
    }
    static associate(db){
        //테이블간 관계를 정의
        db.User.hasMany(db.Post, {foreignKey:'user_id', sourceKey:'user_id'});
        
    }
}
module.exports = User;