const express = require('express');
const multer = require('multer');
const { v4: uuid } = require("uuid");
const { BlobServiceClient } = require("@azure/storage-blob");
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;

const connection = process.env.AZURE_STORAGE_CONNECTION;
const accessKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
let caller = '';
let userid = '';
const router = express.Router();
// const fs = require('fs');

// uploads 디렉토리가 없으면 생성
// const dir = 'uploads/';
// !fs.existsSync(dir)&& fs.mkdirSync(dir);



//blob파일명, 경로 설정
const resolveBlobName = (req, file) => {
      //본인이 사용하고 싶은 경로 밑 blob파일명을 설정해주는 로직을 만들어 주면된다.
      //경로 설정 /test/파일이름   =>  컨테이너 명/test/파일명 으로  생성
      const uniqueFileName = uuid() + '.' + file.mimetype.split('/')[1];
      if (userid === '' || userid==='undefined' || userid === undefined) 
        blobName = uniqueFileName;
      else
        blobName = userid+'/'+uniqueFileName;  
      return blobName;
};

// 컨테이너명도 설정. 컨테이너에서는 경로설정불가
const container = (req, file) => {
  
  let containerName = '';
  if (caller === 'request') 
    containerName = 'img-request'
  else if (caller === 'profile') 
    containerName = 'img-profile';
  else if (caller === 'bugdic')
    containerName = 'img-bugdic';
  // const containerName = req.body.container
  return containerName
}

//메타 데이터도 설정 할 수 있다.
//const resolveMetadata = (req, file) => {
//    return new Promise((resolve, reject) => {
//        const metadata = yourCustomLogic(req, file);
//        resolve(metadata);
//    });
//};

const azureStorage = new MulterAzureStorage({
    connectionString : connection, // connectionString  혹은 accessKey+accountName 조합으로 사용해도 됨
    accessKey : accessKey,
    accountName : accountName,
    //컨테이너 명
    containerName: container,
    //blob파일 이름 밑 경로 설정
    blobName: resolveBlobName,
    //메타데이터 
    //metadata: resolveMetadata,
    //'blob' or 'container' or 'private' 으로 업로드 파일 등급을 변경 할수있다.
    containerAccessLevel: 'blob',
    urlExpirationTime: -1 // no expiration
    
});

var storage = multer.diskStorage({
    

    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    },
    fileFilter  : (req, file, cb)=>{
      console.log('id', req.body.id);
      }
  })
  // var upload = multer({ storage: azureStorage })
var upload = multer({ storage: azureStorage }).single("file")  
// var upload = multer({ storage: azureStorage }).any(); 

router.post('/',  (req, res) => {
    caller = req.query.caller;
    userid = req.query.userid;
    console.log('caller:', caller, 'userid:', userid);
    
    upload(req, res, err =>{
        if(err){
          console.log('err:', err);
          return res.json({success: false, err});

        }
        // console.log('reqfiels:', res.req.file.url)
        // console.log('filename:', res.req.file.blobName);
        // console.log('container:', res.req.file.container);
        return res.json({success: true, filePath: res.req.file.url.split('?')[0] , fileName: res.req.file.blobName})
    })
})

    
// delete image from azure blob storage
router.delete('/',  (req, res) => {
  filepath = req.query.image;
  caller = req.query.caller;

  console.log('image deletion caller:', caller, 'filepath:', filepath);
  const container = filepath.split('/')[3];
  let uniqueFileIdentifier = '';
  if (caller == 'request' || caller == 'bugdic') {
    uniqueFileIdentifier = filepath.split('/')[4] + '/'+ filepath.split('/')[5];
    // console.log('uniqueFileIdentifier:', uniqueFileIdentifier);
  }
  else if (caller == 'profile') {
    uniqueFileIdentifier = filepath.split('/')[4];
    // console.log('uniqueFileIdentifier:', uniqueFileIdentifier);
  }  
  const { BlobServiceClient } = require("@azure/storage-blob");
  const blobServiceClient = BlobServiceClient.fromConnectionString(connection);
  const containerClient = blobServiceClient.getContainerClient(container);
  containerClient.getBlockBlobClient(uniqueFileIdentifier).deleteIfExists()
  .then((result) => {
    // console.log('result:', result.succeeded);
    if (result.succeeded)
      return res.json({success: true})
    else
      return res.json({success: false, err: '파일 삭제 실패'})
  }).catch((err) => {
    console.log('err:', err);
    return res.json({success: false, err})
  });
}
  
)

module.exports = router;