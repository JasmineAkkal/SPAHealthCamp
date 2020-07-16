
var http = require('http');  
var express = require('express')
var path = require('path');
var url = require('url');  
var fs = require('fs');
  
var app = express();
var session = require('express-session');
app.use(express.static(__dirname+"/scripts"));
app.use(session({ secret: 'ok', resave:false, saveUninitialized:true}));
app.get("/",function(request,response){
	response.sendFile(path.join(__dirname+"/scripts/Demographics.html"));
})
app.listen(8080);
const bodyParser = require('body-parser');

const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'healthcamp'
});
 
// connect to database
mc.connect();
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
 
 
 //app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());

app.post('/reports', function(req, res) {
  //res.send(req.body);
  //console.log(req.body);
  //res.send(req.body);
 
  var fname = JSON.stringify(req.body.firstname);
  //console.log(JSON.stringify(req.body.fname));
  var lname = JSON.stringify(req.body.lastname);
  var gender = JSON.stringify(req.body.gender);
  var age = JSON.stringify(req.body.age);
  var notes = JSON.stringify(req.body.notes);
  var img = JSON.stringify(req.body.img);
  //INSERT INTO students (name,rollno,marks) VALUES ?", [records]
  //('fname','lname','gender',22,'notes')"
  //Values ?,?,?,?,?",[fname],[lname],[gender],[age],[notes]
  //INSERT INTO tasks SET ? ", { task: task }
  //(firstname, lastname, gender, age, notes_of_other_details)
  //INSERT INTO tasks SET action = :action, share = :share, full_path = :full_path, additional_info = :additional_info, complete = :complete
  //mc.query("INSERT INTO user_information SET ? ? ? ? ? ", {firstname:fname,lastname:lname,gender:gender,age:age,notes_of_other_details:notes} , function (error, results, fields) {
  mc.query("INSERT INTO user_information (firstname, lastname, gender, age, notes_of_other_details,Image_src) VALUES  ( " +
        fname + " , " +
        lname + " , " +
        gender + " , " +
		age + " , " +
		notes + " , " +
        img + " ) " , function (error, results, fields) {
			
			//console.log(results.insertId);
			req.session.userId = results.insertId;
			console.log(req.session.userId);
        if (error) throw error;
		return res.redirect('/reports.html');
        //return res.send({ error: false, data: results, message: 'Reports.' });
    });
	
	
});


app.post('/reportsVitals', function(req, res) {
  console.log(req.session.userId);
  var user_id = req.session.userId;
  var body_temp = JSON.stringify(req.body.body_temp);
  var bp = JSON.stringify(req.body.bp);
  var pulse = JSON.stringify(req.body.pulse);
  var medi = JSON.stringify(req.body.medi);
  var weight = JSON.stringify(req.body.weight);
  var height = JSON.stringify(req.body.height);
  var extra_notes = JSON.stringify(req.body.extra_notes);
  
  mc.query("INSERT INTO health_information (Height, Weight, body_Temprature, pulse_rate, bp, Medications, extra_notes,User_ID) VALUES  ( " +
        height + " , " +
        weight + " , " +
        body_temp + " , " +
		pulse + " , " +
		bp + " , " +
		medi + " , " +
		extra_notes + " , " +
        user_id + " ) " , function (error, results, fields) {
        if (error) throw error;  
        //return res.redirect('/reports.html');
    });
	
});

app.post('/generateReport', function(req, res) {
  console.log(req.session.userId);
  var user_id = req.session.userId;
  var body_temp = JSON.stringify(req.body.body_temp);
  var bp = JSON.stringify(req.body.bp);
  var pulse = JSON.stringify(req.body.pulse);
  var medi = JSON.stringify(req.body.medi);
  var weight = JSON.stringify(req.body.weight);
  var height = JSON.stringify(req.body.height);
  var extra_notes = JSON.stringify(req.body.extra_notes);
  
  mc.query('Select * from user_information ui left outer join health_information hi on ui.User_ID = hi.User_ID', function (error, results, fields) {
        if (error) throw error;
		
		/*const data = new Array(result.length)

                        for (var i = 0; i < result.length; i++) {
                            data[i] = {
                                pid: result[i].firstname,
                                
                            }

                        }*/
		//res.end(JSON.stringify(data))
         res.json(results);
    });
	
});

// Retrieve all reports 
/*app.get('/reports', function (req, res) {
	console.log(req.body);
    mc.query('Select ui.firstname,ui.age,ui.gender,ui.Image_src,hi.medications,hi.extra_notes from user_information ui left outer join health_information hi on ui.User_ID = hi.User_ID', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Reports.' });
    });
});*/

// Retrieve todo with id 
app.get('/todo/:id', function (req, res) {
 
    let task_id = req.params.id;
 
    if (!task_id) {
        return res.status(400).send({ error: true, message: 'Please provide task_id' });
    }
 
    mc.query('SELECT * FROM tasks where id=?', task_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Todos list.' });
    });
 
}); 

var http = require('http');  
var url = require('url');  
var fs = require('fs');  
var server = http.createServer(function(request, response) {  
    var path = url.parse(request.url).pathname;  
    switch (path) {  
        case '/':  
            response.writeHead(200, {  
                'Content-Type': 'text/plain'  
            });  
            response.write("This is Test Message.");  
            response.end();  
            break;  
        case '/Demographics.html':  
            fs.readFile(__dirname + path, function(error, data) {  
                if (error) {  
                    response.writeHead(404);  
                    response.write(error);  
                    response.end();  
                } else {  
                    response.writeHead(200, {  
                        'Content-Type': 'text/html'  
                    });  
                    response.write(data);  
                    response.end();  
                }  
            });  
            break;  
        case '/HtmlPage2.html':  
            fs.readFile(__dirname + path, function(error, data) {  
                if (error) {  
                    response.writeHead(404);  
                    response.write(error);  
                    response.end();  
                } else {  
                    response.writeHead(200, {  
                        'Content-Type': 'text/html'  
                    });  
                    response.write(data);  
                    response.end();  
                }  
            });  
            break;  
        default:  
            response.writeHead(404);  
            response.write("opps this doesn't exist - 404");  
            response.end();  
            break;  
    }  
});  
//server.listen(8082);  


// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
/*app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});*/