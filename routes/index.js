var express = require('express');
var router = express.Router();

// crawlingSvc.js 파일 import
var crawlingSvc = require('../service/crawlingSvc.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getPrice', async function(req, res) {
  var result;

  // name parameter가 null 이면 매개변수를 all로 호출, null이 아니면 입력 값 그대로 호출
  if(req.query.name){
    result = await crawlingSvc.getCommodityPrice(req.query.name);
  }else{
    result = await crawlingSvc.getCommodityPrice('all');
  }
  
  console.log(JSON.stringify(result));
  res.send(result);
});

module.exports = router;
