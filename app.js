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

// app.get('/', (req, res, next) => {
//   res.render('index', {
//     title: 'Task:'
//   });
// });
app.listen(80);
});
