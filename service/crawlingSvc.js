const puppeteer = require('puppeteer');

// 각 원자재 이름과 URL 정보가 있는 MAP을 생성
const urlMap = new Map([
  ['silver','https://kr.investing.com/commodities/silver'],
  ['wti','https://kr.investing.com/commodities/crude-oil'],
  ['gas','https://kr.investing.com/commodities/natural-gas']
]);

let getCommodityPrice = async function(comdiName) { 
  // puppeteer 실행
  console.log('#1',comdiName);
  const browser = await puppeteer.launch({ 
    //args: ['--no-sandbox'],
    //executablePath: '/usr/bin/chromium-browser',
    //args: ['--no-sandbox','--disable-dev-shm-usage'],
    //executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--headless', '--disable-gpu']
    //headless:true,
    });
  const page = await browser.newPage(); 

  // 매개변수가 all이면 전체 map을 수행, 아니면 해당 원자재만 수행
  var resultList = new Array();
  if(comdiName === 'all'){
    let urlKeys = urlMap.keys();
    for(var v of urlKeys){
        await getPrice(v);
    }
  }else {
    await getPrice(comdiName);
  }
  console.log('#2',comdiName);
  async function getPrice(v){
    
    // map에 저장된 url 가져와서 방문
    var url = urlMap.get(v);
    console.log('#3',v,url);
    await page.goto(url);
    console.log('#4',url);
    // 가격 보여지는 DIV가 페이지 나타나면, 가격 값을 가져 옴
    await page.waitForSelector('div[data-test="instrument-header-details"]'); 
    let comdiPrice = await page.$eval('div[data-test="instrument-header-details"] span[data-test="instrument-price-last"]', x=> x.innerHTML);
  
    console.log(v,':',comdiPrice,'$');
    // Json 형태로 결과를 생성
    resultList.push({
        name:v,
        price:comdiPrice
    });
  }

  await browser.close();

  return resultList;
}
 // 다른 js 파일에서 참조하기 위해 Export 설정
module.exports.getCommodityPrice = getCommodityPrice;