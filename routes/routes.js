let express = require('express');
let route = express.Router();
const cheerio = require('cheerio');
const https = require('https');
const request = require('request');
var rp = require('request-promise');
const fs = require('fs');

let db = require('../model/model.js');

route.get('/', (req, res, next)=>{

     // parse();
    db.findAll((err, nested, cats)=>{

        if(err)
        return res.render('404');
        // console.log(data);
        res.render('index', {
            title:"All Widgets",
            route_url:"/",
            // arrCards:data
            catArray: cats,
            itemArray: nested
        });
    });
});

function parse(link, callback){
  // let options = {
  //   uri: "https://market.yandex.ru/product--chasy-nastolnye-philips-somneo-hf3650/332872019",
  //   transform: function(body){
  //     return cheerio.load(body);
  //   }
  // };
  //
  // rp(options).then(function ($) {
  //       console.log($(".n-title__text>.title.title_size_28.title_bold_yes").text());
  //       let p = $(".n-gallery__item>.n-gallery__image").attr("src");
  //       console.log($("#n-breadcrumbs> li:first-child span[itemprop='name']").text());
  //       console.log(p);
  //
  // }).catch(function (err) {
  //   console.log("Error!");
  // });

  // https.get("https://market.yandex.ru/product--chasy-nastolnye-philips-somneo-hf3650/332872019",(response) => {
  https.get(link,(response) => {
    let html ="";
    response.on('data', (chunk)=>{html+=chunk});
    response.on('end',() => {
      let $ = cheerio.load(html);
      let category, card;

      let cardName = $(".n-title__text>.title.title_size_28.title_bold_yes").text();
      cardName = cardName.slice(0,30);
      let catName = $("#n-breadcrumbs> li:first-child span[itemprop='name']").text();

      let p = $(".n-gallery__item>.n-gallery__image").attr("src");
      let img_path = saveImage("http:"+p);
      let originalCategoryLink = "https://market.yandex.ru" + $("#n-breadcrumbs> li:first-child > a[itemprop='item']").attr("href");

      getOriginalCategory(originalCategoryLink, (err, cat) => {

        category = {category: cat, icon_path: "icon_clothes.png"};
        card = {card_id: 10, title: cardName, info:"info", img_path: img_path, category: cat, item_link: link };

        callback(null, category, card);
      });
    })
  });

}

function getOriginalCategory(link, callback){
  https.get(link,(response) => {
    let html ="";
    response.on('data', (chunk)=>{html+=chunk});
    response.on('end',() => {
      let $ = cheerio.load(html);
      let catName = $("#n-breadcrumbs> li:first-child span[itemprop='name']").text();
      callback(null, catName)
    });
    });
}

function saveImage(path){
  let filePath= createFileName();
  request.head(path, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(path).pipe(fs.createWriteStream("public/img/"+filePath)).on('close', ()=>{console.log("file saved");});
  });
  return filePath

}

function createFileName() {

   let result           = '';
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < 8; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   result+=".png";
   return result;
}


route.post('/add', (req, res, next)=>{
    console.log(req.body.link);
    parse(req.body.link, (err,category, card) => {

      db.create(category, card, (err)=>{
    		if(err) return res.sendStatus(500);
    		res.redirect('/');
    	});
    });


});

route.post('/delete', (req, res, next)=>{
    db.delete(req.body.id, (err, data)=>{
        if (err || !data)
            return res.send('Error delete widget!');

        console.log("deleted id: "+data);
        res.redirect('/');
    });
});



module.exports = route;
