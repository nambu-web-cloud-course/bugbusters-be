const Sequelize = require('sequelize');

class Code extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            { //테이블의 컬럼 정의
                category: { // code category
                    type: Sequelize.STRING(50),
                    allowNull: false,
                },
                keyid: { // 키
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                value: { // 깂
                    type: Sequelize.STRING(50),
                    allowNull: false,
                },
                

            },
            {
                sequelize,
                timestamps: true, // true 이면 createdAt, updatedAt 컬럼 자동 추가
                underscored: true, // 테이블명과 컬럼명을 camelCase, snake_case 선택
                modelName: 'Code', // 모델이름
                tableName: 'codes', // 테이블이름
                paranoid: true, // true이면 deletedAt컬럼이 자동으로 생성되고 삭제시 삭제하지 않음
                charset: 'utf8', // 인코딩, utf8mb : 이모지 포함
                collate: 'utf8_general_ci', // 정렬시 비교기준
            }
        );
    }
    static associate(db){
        //테이블간 관계를 정의
    }
}


module.exports = Code;