var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter =  require('./routes/test');

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
app.use('/test', testRouter);

//check that the user details entered match a users on the users table of the database
app.post('/checkTheLogin', function (req, res) {
   
   // catching the variables
  var username = req.body.username;  
  var pass = req.body.password;
  
  //setting the user name into the session
  req.session.username = username;
  req.session.validSession = true;
 //for sessions
  var timeLeft = req.session.cookie.maxAge/ 1000;
  console.log("Time left" + timeLeft);  
  
 
  
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gnb",
  password: ""
  });
  
  
  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM users WHERE username = '"+username+"' AND PASSWORD = '"+pass+"' LIMIT 1;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
	//return the acctype back
    res.send(result[0].acctype);
    
  });
});

   
   
   
   
});

//inserting new user registration details

app.post('/putInDatabase', function (req, res) {
  
  // catching the variables
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;
  var email = req.body.email;
  var pass = req.body.password;
  var height = req.body.height;
  var age = req.body.age;
  var weight = req.body.weight;
  var acctype = req.body.acctype;
  
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');

  
 // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gnb",
  password: ""
  });
  
  
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO `gnb`.`users` (`firstname`, `lastname`, `username`, `email`, `password`, `height`, `age`, `weight`, `acctype` )  VALUES ('"+firstname+"', '"+lastname+"',  '"+username+"', '"+email+"', '"+pass+"', '"+height+"', '"+age+"', '"+weight+"', '"+acctype+"');";
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
  res.send('Data went to the database');
  
  
})

//requesting the various exercise types from the database
app.get('/getMovements', function (req, res) {
   
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gnb",
  password: ""
  });
  
  
    con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * from exercisegroup", function (err, result, fields) {
    if (err) throw err;
   
    
    
	var output = '';
    for(var i=0; i < result.length; i++){
        

       output = output + `
       <div class="ui-field-contain">
       <label for="select-native-2">`+result[i].group+`</label>
       </div> 
	   
       <img src="`+result[i].picturepath+`" style="height:100px;width:300px">
       <button id= "logWorkout" onclick="logWorkout('`+result[i].group+`')" class ="ui-logbtn">Log your `+result[i].group+` workout</button>
	   
	     
		
      `;  

 
    }
    

    
    res.send(output);
    
    
    
  });
});

  
  
  
});

//displaying the exercises from the strength table and allowing the users to add their details for each type
app.get('/getStrength', function (req, res) {
   
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gnb",
  password: ""
  });
  
  
    con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * from strength", function (err, result, fields) {
    if (err) throw err;
   
    
    var output = '';
    for(var i=0; i < result.length; i++){
        

       output = output + `
	   
       <div class="ui-field-contain">
       <label for="select-native-2">`+result[i].moveid+`</label> <br>
		</div>
		</br>
		Sets 
		<input type="text" id="`+result[i].moveid+`_sets" width ="50px"/> <br>
		</br>
		Reps <input type="text" id="`+result[i].moveid+`_reps"/> <br>
		</br>
		Time/Intervals <input type="text" id="`+result[i].moveid+`_intervals"/> <br>
        <br></br>
		<button id="addtolog" onclick="addToLog('`+result[i].moveid+`_sets','`+result[i].moveid+`_reps','`+result[i].moveid+`_intervals')"> Save </button>	
					
		`;  
        
    }
    

    
    res.send(output);
    
    
    
  });
});

  
  
  
});  



//displaying the exercises from the conditioning table and allowing the users to add their details for each type

app.get('/getConditioning', function (req, res) {
   
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gnb",
  password: ""
  });
  
  
    con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * from conditioning", function (err, result, fields) {
    if (err) throw err;
   
    
    var output = '';
    for(var i=0; i < result.length; i++){
        

       output = output + `
	   
       <div class="ui-field-contain">
       <label for="select-native-2">`+result[i].moveid+`</label> <br>
		</div>
		</br>
		Sets <input type="text" id="`+result[i].moveid+`_sets" width ="50px"/> <br>
		</br>
		Reps <input type="text" id="`+result[i].moveid+`_reps"/> <br>
		</br>
		Time/Intervals <input type="text" id="`+result[i].moveid+`_intervals"/> <br>
        <br></br>
		<button id="addtolog" onclick="addToLog('`+result[i].moveid+`_sets','`+result[i].moveid+`_reps','`+result[i].moveid+`_intervals')"> Save </button>	
					
		`;  
        
    }
    

    
    res.send(output);
    
    
    
  });
});

  
  
  
}); 

//displaying the exercises from the cardio table and allowing the users to add their details for each type
app.get('/getCardio', function (req, res) {
   
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gnb",
  password: ""
  });
  
  
    con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * from cardio", function (err, result, fields) {
    if (err) throw err;
   
    
    var output = '';
    for(var i=0; i < result.length; i++){
        

       output = output + `
	   
       <div class="ui-field-contain">
       <label for="select-native-2">`+result[i].moveid+`</label> <br>
		</div>
		</br>
		Sets <input type="text" id="`+result[i].moveid+`_sets" width ="50px"/> <br>
		</br>
		Reps <input type="text" id="`+result[i].moveid+`_reps"/> <br>
		</br>
		Time/Intervals <input type="text" id="`+result[i].moveid+`_intervals"/> <br>
        <br></br>
		<button id="addtolog" onclick="addToLog('`+result[i].moveid+`_sets','`+result[i].moveid+`_reps','`+result[i].moveid+`_intervals')"> Save </button>	
					
		`;  
        
    }
    

    
    res.send(output);
    
    
    
  });
});

  
  
  
}); 

//saving the users workout details to the workouts table
 app.post('/logWorkout', function (req, res) {
  
 
  // catching the variables
  var gymnut = req.body.gymnut;
  var workoutlog = req.body.workoutlog;
   
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');

  
 // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gnb",
  password: ""
  });
  
  
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  
  var sql = "INSERT INTO `gnb`.`workouts` (`gymnut`, `workoutlog`)  VALUES ('"+gymnut+"', '"+workoutlog+"');";
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
  res.send('Data went to the database');
  
  
}) 
 //displating a list of all users on the users table to an admin user
app.get('/getAdminData', function (req, res) {
   
 

  
  // put the data in the database
  // pulling in mysql
  var mysql = require('mysql');
   // set up a connection  
  var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gnb",
  password: ""
  });
  
  
   

  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM users;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
	
	var output = '';
	
    for(var i=0; i < result.length; i++){
        

       output = output + `		
			
			<table data-role = "table-stroke" class ="table-stroke" style = "width: 100%;">
			<colgroup>
				<col span="1" style="width: 10%;"></col>
				<col span="1" style="width: 10%;"></col>
				<col span="1" style="width: 10%;"></col>
				<col span="1" style="width: 10%;"></col>
				<col span="1" style="width: 10%;"></col>
				<col span="1" style="width: 10%;"></col>
				<col span="1" style="width: 10%;"></col>
				<col span="1" style="width: 10%;"></col>
				<col span="1" style="width: 10%;"></col>
				<col span="1" style="width: 10%;"></col>
			</colgroup>
			<tr>
				<td>`+result[i].id+`</td>
				<td>`+result[i].firstname+`</td>
				<td>`+result[i].lastname+`</td>
				<td>`+result[i].username+`</td>
				<td>`+result[i].email+`</td>
				<td>`+result[i].height+`</td>
				<td>`+result[i].weight+`</td>
				<td>`+result[i].age+`</td>
				<td>`+result[i].acctype+`</td>
				
			</tr>
			</table>
   			
	

       
	     
		
      `;  

 
    }
    

    
 res.send(output);
    
    
    
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


