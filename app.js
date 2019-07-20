let express = require('express');
let mustacheExpress = require('mustache-express'); //подключаемшаблонизатор
let bodyParser = require('body-parser'); //подключаемпарсертелаPOST запросов

let model = require('./model/model.js');
let app = express(); //подключаем модуль роутера по работе с виджетами
let widgetRoute = require('./routes/routes.js'); //регистрируем модуль шаблонизации Mustacheв Express

model.init(function () {

app.set('views', __dirname + '/views');

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache'); //регистрируем модуль парсера тела POST запросов

app.use(bodyParser.urlencoded({
  extended: false
})); //регистрируем роутер по пути: /widgets
app.use(express.static('./public'));
app.use('/', widgetRoute); //вешаем обработчик отдачи стартовой страницы

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});
// app.get('/', (req, res, next) => {
//   res.render('index', {
//     title: 'Task:'
//   });
// });
app.listen(80);
});
