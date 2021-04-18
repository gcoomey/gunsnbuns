var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 60000 }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/getDriverData', function (req, res) {
   
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
   
// hold the data that we going to send back.
var output = '';


  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT id, orderby, items FROM orders;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
   
    
    // looping over the records
    for(var i=0; i< result.length; i++){
        output = output + result[i].id + '--' +result[i].orderby + '--' + 
		result[i].items + '<button onclick="markAsDelivered('+result[i].id+')">Item Delivered</button><br>';
    }
    
     // return the output variable
    res.send(output);   
  });
});


  
  
});

app.get('/testSession', function (req, res) {
	
	//set
	req.session.email = 'test@domain.com';
	
	//get
	var temp = req.session.email;

	res.send("hello" + temp);
	});

app.get('/getManagerData', function (req, res) {
   
   req.session.manager = 1
   req.session.email = ''
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
   
// hold the data that we going to send back.
var output = '';


  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT orderby, items FROM orders;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
   
   var runningTotal = 0; 
    
    // looping over the records
    for(var i=0; i< result.length; i++){
        output = output + result[i].orderby + '---' + result[i].items + '<br>';
    // calculate cost
             var items = result[i].items;
	
			var singleTransaction = items.split(',');
			// loop over all the items in a single transaction
            
            for(var x=0; x<singleTransaction.length; x++){
                  console.log(singleTransaction[x]);
                  
                  var singleProduct = singleTransaction[x].split('-');
                                     // qty           *        itemCost
                  var cost = Number(singleProduct[1]) * Number(singleProduct[2]);
                  console.log(cost);
                  
                  // add to running total
                  runningTotal = Number(runningTotal) + Number(cost);
	
	
			}
	
			console.log('------------ Next transaction')
	}
    output = output + 'Total order cost: ' + runningTotal;
	
     // return the output variable
    res.send(output);   
  });
});


  
  
});


app.post('/checkTheLogin', function (req, res) {
   
   // catching the variables
  var username = req.body.username;  
  var pass = req.body.password;
  
  //setting the user name into the session
  req.session.username = username;
  req.session.validSession = true;
  
  var timeLeft = req.session.cookie.maxAge/ 1000;
  console.log("Time left" + timeLeft);  
  
 
  
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM users WHERE username = '"+username+"' AND PASSWORD = '"+pass+"' LIMIT 1;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
	//return the acccount type back
    res.send(result[0].acctype);
    
  });
});

   
   
   
   
});



app.post('/putInDatabase', function (req, res) {
  
  // catching the variables
  var username = req.body.username;
  var email = req.body.email;
  var pass = req.body.password;
  var acctype = req.body.acctype;
  
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');

  
 // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO `test`.`users` (`username`, `email`, `password`, `acctype`) VALUES ('"+username+"', '"+email+"', '"+pass+"', '"+acctype+"');";
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
  res.send('Data went to the database');
  
  
})

app.get('/checkIfTimeLeft', function (req, res) {
var timeLeft = req.session.cookie.maxAge/ 1000;
console.log(timeLeft);

  if(timeLeft<1){
	  
	  res.send('expired');
	  
  }else{
	  res.send('ok');
  }
  
});
app.get('/getProducts', function (req, res) {
   
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
    con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * from products", function (err, result, fields) {
    if (err) throw err;
   
    
    var output = '';
    for(var i=0; i < result.length; i++){
        

       output = output + `
       
       <img src="`+result[i].picturepath+`" style="height:100px;width:100px">
       
       <div class="ui-field-contain">
            <label for="select-native-2">`+result[i].productname+`</label>
           
        <select id="`+result[i].productname+`_qty" name="select-native-2" id="select-native-2" data-mini="true">
                <option value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
         <br>   
         Price: `+result[i].cost+`   
        
        <br>
        <button id="addtocart" onclick="addToCart('`+result[i].productname+`_qty', `+result[i].cost+`)"> Add To Cart </button>

        </div>    
        `;

    }
    

    
    res.send(output);
    
    
    
  });
});

  
  
  
});

app.post('/completeCheckout', function (req, res) {
  
 
  // catching the variables
  var orderby = req.body.orderby;
  var items = req.body.items;
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');

  
 // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO `test`.`orders` (`orderby`, `items`) VALUES ('"+orderby+"', '"+items+"');";
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
  res.send('Data went to the database');
  
  
})

app.post('/updateOrderStatus', function (req, res) {
	
	var id = req.body.id;
	
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');

  
 // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  var sql = "UPDATE `test`.`orders` SET `orderstatus` = 'Delivered' WHERE `id` = "+id+";"
  
  console.log(sql);
  
  con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result, field) {
	  if (err) throw err;
  
  res.send("OK");
  
	
  });
});

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


app.post('/updateOrderStatus', function (req, res) {
	
	var id = req.body.id;
	
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');

  
 // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
  password: ""
  });
  
  var sql = "UPDATE `test`.`orders` SET `orderstatus` = 'Delivered' WHERE `id` = "+id+";"
  
  console.log(sql);
  
  con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result, field) {
	  if (err) throw err;
  
  res.send("OK");
  
	
  });
});

});





