const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

// uploads 디렉토리가 없으면 생성
const dir = 'uploads/';
!fs.existsSync(dir)&& fs.mkdirSync(dir);

var storage = multer.diskStorage({
    

    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
var upload = multer({ storage: storage }).single("file")  


router.post('/',  (req, res) => {
    upload(req, res, err =>{
        if(err){
            return res.json({success: false, err})
        }
        console.log('filename:', res.req.file.filename);
        return res.json({success: true, filePath: res.req.file.path , fileName: res.req.file.filename})
    })
})


module.exports = router;