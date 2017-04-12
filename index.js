var express = require('express');
var app = express();
var bodyParser = require('body-parser');    //json parse
var session = require('express-session');   //세션 관리
var fs = require('fs');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

/*
//get 함수는 HTTP GET request를 특정 함수에 매핑.
app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);
*/
var server = app.listen(3000, function() {
  console.log('Express server has started on 3000');
});

app.use(express.static('public'));  //static resource 사용, css, js 등

//json 처리
app.use(bodyParser.json());
app.use( bodyParser.urlencoded() );
app.use( session({
  secret: '!@#$MYSIG!@#$',  //쿠키 임의 변조값 방지용
  resave: false,
  saveUninitialized: true  //세션이 저장되기 전 uninitialized 상태로 미리 만들어 저장.
}));

var router = require('./router/main')(app, fs);  //모듈 import 및 routing
