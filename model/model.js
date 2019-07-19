let mongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID
// Строка подлючения
let url = 'mongodb://localhost:27017';
//Переменная для хранения подключения к коллекции
let cardCollection, catCollection;

exports.init = function(callback) {
  mongoClient.connect(url, {
    useNewUrlParser: true
  }, (err, client) => {
    if (err) {
      return console.log(err);
    }
    cardCollection = client.db('MainStorage').collection('Cards');

    catCollection = client.db('MainStorage').collection('Categories');
    callback();
  });
};

exports.findAll = function(callback) {

  Promise.all([cardCollection.find().toArray(), catCollection.find().toArray()]).then((results) => {
    let categories, cards;
    cards = results[0];
    categories = results[1];
    let categorySet = new Set(cards.map((card) => {
      return card.category;
    }));
    let presentCategories = [];

    let nested = [];
    for (cat of categories) {
      if (!categorySet.has(cat.category))
        continue

      let cardArr = [];
      for (card of cards) {


        if (card.category === cat.category) {
          cardArr.push(card);
        }
      }

      cat.item_number = cardArr.length;
      presentCategories.push(cat);
      nested.push({
        cat_id: cat._id,
        cat_name: cat.category,
        cards: cardArr
      });
      cat.amount = cardArr.length
    }


    // callback(null, widgets);
    callback(null, nested, presentCategories);
  });


};

exports.create = function(category, card, callback) {

  catCollection.findOne({
    category: category.category
  }).then((result) => {
    if (!result) {
      console.log(result);
      catCollection.insertOne(category, (err, result) => {
        if (err) return callback(err);
      });
    }

  });

  cardCollection.insertOne(card, (err, result) => {
    if (err) return callback(err);
  });
  callback(null)

};


exports.delete = function(id, callback) {
	console.log("here");
	console.log(id);
  cardCollection.deleteOne({_id: ObjectID(id)});
	callback(null,id);
};
