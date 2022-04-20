var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const bodyParser = require("body-parser");

libraryRouter = require('./routes/library');
filePathRouter = require('./routes/filePath');
updateMovieDbRouter = require('./routes/updateMovieDb');
queryMovieRouter = require('./routes/queryMovie');
endDbSessionRouter = require('./routes/endDbSession');
startHttpServerRouter = require('./routes/startHttpServer');
queryMovieByNameRouter = require('./routes/queryMovieByName');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/library', libraryRouter);
app.use('/filepath', filePathRouter);
app.use('/updateMovieDb', updateMovieDbRouter);
app.use('/queryMovie', queryMovieRouter);
app.use('/endDbSession', endDbSessionRouter);
app.use('/startHttpServer', startHttpServerRouter);
app.use('/queryMovieByName', queryMovieByNameRouter);

app.get("/", (req,res)=>{
  res.send("server is running")
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(req.app.get('env'))
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = '3630';

app.listen(port,()=>console.log("server is listening on port: " + port))



//module.exports = app;
