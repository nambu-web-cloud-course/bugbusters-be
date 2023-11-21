const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            { //테이블의 컬럼 정의
                userid: { //아이디
                    type: Sequelize.STRING(15),
                    allowNull: false,
                    unique: true,
                    primaryKey: true
                },
                name: { //이름 (실명)
                    type:Sequelize.STRING(10),
                    allowNull: false,
                },
                password: { // 비번
                    type:Sequelize.STRING(100),
                    allowNull: false,
                },
                gender: { //M: 남자, F:여자
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
                phone: { //휴대폰번호
                    type:Sequelize.CHAR(13),     
                    allowNull: false,
                },
                birthdate: { //생년월일(YYYYMMDD)
                    type:Sequelize.CHAR(8),     
                    allowNull: false,
                },
                usertype: { //사용자 종류 (고객(C, default), 버스터(B))
                    type:Sequelize.CHAR(1),     
                    allowNull: false,
                    defaultValue:'C'
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

        db.User.hasOne(db.Buster, {foreignKey:{name:'userid', allowNull:false}, sourceKey:'userid'});
        db.User.hasMany(db.Request, {foreignKey:{name:'userid', allowNull:false}, sourceKey:'userid'});
        db.User.hasMany(db.Trade, {foreignKey:{name:'userid',allowNull:false}, sourceKey:'userid'});
        
    }

    static getAddresByUserid = async (userid) => {
        const result = await this.findOne({
            attributes: ['addr1', 'addr2', 'zipcode'],
            where: { userid },
            raw: true
        });
    
        return result;
    }
}


module.exports = User;