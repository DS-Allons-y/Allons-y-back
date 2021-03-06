// Express 기본 모듈 불러오기
var express = require("express");
var http = require("http");
var path = require("path");

// Express의 미들웨어 불러오기
var bodyParser = require("body-parser");
var static = require("serve-static");
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 설정정보 모듈
var config = require('./config');

// 데이터베이스 로딩
var database_loader = require('./database/database_loader');

var user = require('./routes/user');

// // Mail 모듈
// var nodemailer = require("nodemailer");

//===== mongoose 모듈 사용 =====//
var mongoose = require("mongoose");

var app = express();

app.set('port', config.server_port || 27017);

app.use('/public', static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
   secret:'my key',
   resave:true,
   saveUninitialized:true
}));

// // body-parser 설정
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

var router = express.Router();

// 회원가입, 클라이언트에서 보내온 데이터를 이용해 데이터베이스에 추가
router.route('/signup').post(user.signup);

// 로그인
router.route('/login').post(user.login);

// 감상목록
router.route('/watchlist').post(user.watchlist);

// 감상결과
router.route('/watchresult').post(user.watchresult);

// 초대 코드 입장
router.route('/enterRoom').post(user.enterroom);

router.route('/email').post(user.email);

// 리액션공유 방 생성
router.route('/makeRoom').post(user.makeRoom);

// 장면분석
router.route('/sceneAnalyze').post(user.sceneAnalyze);

// 수행모델- 감정이 같은지 확인
//router.route('/sameEmotion').post(user.saveEmotion)

router.route('/logout').post(user.logout);

// 혼자보기 - 영화검색 페이지에 영화정보 보내기
router.route('/getAllMovieList').post(user.getAllMovieList);

// 감상 시작 시 신호
router.route('/watchAloneStart').post(user.watchAloneStart);

// s3버킷으로 사진보낼 때마다 ( 혼자보기 : 집중도, 감정분석 )
router.route('/watchImageCaptureEyetrack').post(user.watchImageCaptureEyetrack);

// s3 버킷으로 사진보낼 때마다 ( 같이보기 : 감정분석 )
router.route('/watchTogetherImageCapture').post(user.watchTogetherImageCapture);

// 혼자보기 감상 종료 시 신호
router.route('/watchAloneEnd').post(user.watchAloneEnd);

// 같이보기 감상 종료 시 신호
router.route('/watchTogetherEnd').post(user.watchTogetherEnd);

// 리뷰 등록 시 신호
router.route('/addReview').post(user.addReview);

app.use('/', router);

const server = http.createServer(app).listen(app.get("port"), function () {
  console.log("서버 시작됨");
  
  database_loader.init(app, config);
});