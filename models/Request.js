const Sequelize = require('sequelize');

class Request extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            { //테이블의 컬럼 정의
                content: { //요청사항
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                price: { //금액 
                    type:Sequelize.INTEGER,
                    allowNull: false,
                },
                gender: { // 성별(여성만-F, 남성만-M, 무관-A)
                    type:Sequelize.CHAR(1),
                    allowNull: false,
                },
                addr1: { //도로명 주소
                    type:Sequelize.STRING(50),      
                    allowNull: false,
                },
                addr2: { //상세 주소
                    type:Sequelize.STRING(50),         
                    allowNull: false,
                },
                zipcode: { //우편번호
                    type:Sequelize.CHAR(5),     
                    allowNull: false,
                },
                sido: { //시도
                    type:Sequelize.STRING(10),     
                    allowNull: false,
                    defaultValue:"서울시"
                },
                sigungu: { //시군구
                    type:Sequelize.STRING(20),     
                    allowNull: false,
                },
                state: { // 상태값: 진행중(IP),결제 요청중(PR) 취소(CA), 완료(CP)
                    type:Sequelize.CHAR(2),
                    allowNull: false,
                    defaultValue:"IP",
                },

            },
            {
                sequelize,
                timestamps: true, // true 이면 createdAt, updatedAt 컬럼 자동 추가
                underscored: true, // 테이블명과 컬럼명을 camelCase, snake_case 선택
                modelName: 'Request', // 모델이름
                tableName: 'requests', // 테이블이름
                paranoid: true, // true이면 deletedAt컬럼이 자동으로 생성되고 삭제시 삭제하지 않음
                charset: 'utf8', // 인코딩, utf8mb : 이모지 포함
                collate: 'utf8_general_ci', // 정렬시 비교기준
            }
        );
    }
    static associate(db){
        //테이블간 관계를 정의
        // db.Buster.belongsTo(db.User, {foreignKey:'user_userid', sourceKey:'userid'});
        db.Request.belongsTo(db.User, {foreignKey:{name:'userid', allowNull:false}, sourceKey:'userid' });
        db.Request.hasMany(db.Trade, {foreignKey:{name:'reqid', allowNull:false}, sourceKey:'id'});
    }
}
module.exports = Request;