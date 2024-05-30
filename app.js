var express = require('express');
var app = express();
var path = require('path');
var dateTime = require('node-datetime');
var fs = require("fs");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var multer  = require('multer');

app.use(cookieParser())
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'));
app.use(urlencodedParser);
app.use(express.static(path.join(__dirname,'tmp')));
var upload = multer({ dest: './uploads' });
app.use(upload.single('file'));
app.use(upload.array('multiInputFileName'));
// app.use(upload.fields('file'));

 //---------------get, post with File system-----------------------------------------
app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})
var user = {
   "user4" : {
      "name" : "mohit",
      "password" : "password4",
      "profession" : "teacher",
      "id": 4
   }
}
app.post('/addUser', function (req, res) {
   // First read existing users.
   fs.readFile(  __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse(data);
       data["user4"] = user["user4"];
       console.log( data );
       res.end( JSON.stringify(data));
   });
})
// app.get('/:id', function (req, res) {
//     // First read existing users.
//     fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//        var users = JSON.parse( data );
//        var user = users["user" + req.params.id] 
//        console.log( user );
//        res.end( JSON.stringify(user));
//     });
//  })
var id = 2;
app.delete('/deleteUser', function (req, res) {

    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        delete data["user" + 2];
        
        console.log( data );
        res.end( JSON.stringify(data));
    });
 })
 //--------------get, post, req, res demo with postman-----------------------------------------
 // This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
 })
 // This responds a POST request for the homepage
 app.post('/', function (req, res) {
    console.log("Got a POST request for the homepage");
    res.send('Hello POST');
 })
 // This responds a DELETE request for the /del_user page.
 app.delete('/del_user', function (req, res) {
    console.log("Got a DELETE request for /del_user");
    res.send('Hello DELETE');
 })
 // This responds a GET request for the /list_user page.
 app.get('/list_user', function (req, res) {
    console.log("Got a GET request for /list_user");
    res.send('Page Listing');
 })
 // This responds a GET request for abcd, abxcd, ab123cd, and so on
 app.get('/ab*cd', function(req, res) {   
    console.log("Got a GET request for /ab*cd");
    res.send('Page Pattern Match');
 })

 app.post("/hariPostReq/:id/:name:/", function (req, res) {
    console.log(req.body.user.name)
});
 //------------------get, post in web page--------------------------------------
 app.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.htm" );
 })
 app.get('/process_get', function (req, res) {
    // Prepare output in JSON format
    response = {
       first_name:req.query.first_name,
       last_name:req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
 })
app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
       first_name:req.body.first_name,
       last_name:req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
 }) 
 //-----------File uploading---------------------------------------------
 app.post('/file_upload', function (req, res) {
    console.log(req.file.name);
    console.log(req.file.path);
    console.log(req.file.type);
    var file = __dirname + "/" + req.file.name;
    
    fs.readFile( req.file.path, function (err, data) {
       fs.writeFile(file, data, function (err) {
          if( err ){
             console.log( err );
             } else {
                response = {
                   message:'File uploaded successfully',
                   filename:req.file.originalname
                };
             }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
    });
 })
 app.post('/multi_files_upload', function (req, res) {
    console.log(req.files[0].name);
    console.log(req.files[0].path);
    console.log(req.files[0].type);
    var file = __dirname + "/" + req.files[0].name;
    
    fs.readFile( req.files[0].path, function (err, data) {
       fs.writeFile(file, data, function (err) {
          if( err ){
             console.log( err );
             }else{
                response = {
                   message:'File uploaded successfully',
                   filename:req.files[0].name
                };
             }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
    });
 })
 //------------Cookies Management--------------------------------------------
 app.get('/cookie', function(req, res) {
    console.log("Cookies: ", req.cookies)
 })
 //--------------------------------------------------------
 var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Listening at http://%s:%s", host, port)
})
//-------------Another way to make connection-------------------------------------------------
var http = require("http");
var url = require('url');
// http.createServer(function (request, response) {

//     // Send the HTTP header 
//     // HTTP Status: 200 : OK
//     // Content Type: text/plain
//     response.writeHead(200, {'Content-Type': 'text/plain'});
    
//     // Send the response body as "Hello World"
//     response.end('Hello World\n');
//  }).listen(8082);
 
//  // Console will print the message
//  console.log('Server running at http://127.0.0.1:8082/');

 //---------------------------------------------------
// Create a server
http.createServer( function (request, response) {  
    // Parse the request containing file name
    var pathname = url.parse(request.url).pathname;
    // Print the name of the file for which request is made.
    console.log("Request for " + pathname + " received.");
    // Read the requested file content from file system
    fs.readFile(pathname.substr(1), function (err, data) {
       if (err) {
          console.log(err);
          // HTTP Status: 404 : NOT FOUND
          // Content Type: text/plain
          response.writeHead(404, {'Content-Type': 'text/html'});
       }else {	
          //Page found	  
          // HTTP Status: 200 : OK
          // Content Type: text/plain
          response.writeHead(200, {'Content-Type': 'text/html'});	
          // Write the content of the file to response body
          response.write(data.toString());		
       }
       // Send the response body 
       response.end();
    });
 }).listen(8083);
 // Console will print the message
 console.log('Server running at http://127.0.0.1:8083/');
 //---------------------------------------------------
//--------------Event handler------------------------------------------------
// Import events module
var events = require('events');
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();
// Create an event handler as follows
var connectHandler = function connected() {
   console.log('connection succesful!');
   // Fire the data_received event 
   eventEmitter.emit('data_received');
}
// Bind the connection event with the handler
eventEmitter.on('connection', connectHandler);
 
// Bind the data_received event with the anonymous function
eventEmitter.on('data_received', function(){
   console.log('data received succesfully!');
});
// Fire the connection event 
eventEmitter.emit('connection');
//--------------:Events------------------------------------------------
// fs.readFile('datas.txt', function (err, data) {
//     if (err){
//        console.log(err.stack);
//        return;
//     }
//     console.log(data.toString());
//  });
//  console.log("Reading File Code Ended");
//--------------:Events continues------------------------------------------------
// listener #1
var listner1 = function listner1() {
    console.log('listner1 executed.');
 }
 // listener #2
 var listner2 = function listner2() {
   console.log('listner2 executed.');
 }
 // Bind the connection event with the listner1 function
 eventEmitter.addListener('connection', listner1);
 // Bind the connection event with the listner2 function
 eventEmitter.on('connection', listner2);
 var eventListeners = require('events').EventEmitter.listenerCount
    (eventEmitter,'connection');
 console.log(eventListeners + " Listner(s) listening to connection event");
 // Fire the connection event 
 eventEmitter.emit('connection');
 // Remove the binding of listner1 function
 eventEmitter.removeListener('connection', listner1);
 console.log("Listner1 will not listen now."); 
 // Fire the connection event 
 eventEmitter.emit('connection');
 eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
 console.log(eventListeners + " Listner(s) listening to connection event");
 console.log("Event Program Completed Here.");
// //--------------:Node.js - Buffers------------------------------------------------
// var buf = new Buffer(26);
// for (var i = 0 ; i < 26 ; i++) {
//   buf[i] = i + 97;
// }
// console.log( buf.toString('ascii'));       // outputs: abcdefghijklmnopqrstuvwxyz
// console.log( buf.toString('ascii',0,5));   // outputs: abcde
// console.log( buf.toString('utf8',0,5));    // outputs: abcde
// console.log( buf.toString(undefined,0,5)); // encoding defaults to 'utf8', outputs abcde
// var len = buf.write("Simply Easy Learning");
// console.log("Octets written : " + len);
// buf = new Buffer("Simply Easy Learning"); 
// var json = buf.toJSON(buf.toString('ascii'));
// console.log(json);

// var buffer1 = new Buffer('TutorialsPoint ');
// var buffer2 = new Buffer('Simply Easy Learning');
// var buffer3 = Buffer.concat([buffer1,buffer2]);
// console.log("buffer3 content: " + buffer3.toString());
//--------------:Node.js - Streams, Compression, Decompression------------------------------------------------
// var zlib = require('zlib');
// // Compress the file datas.txt to datas.txt.gz
// fs.createReadStream('datas.txt')
//    .pipe(zlib.createGzip())
//    .pipe(fs.createWriteStream('datas.txt.gz'));
// console.log("File Compressed.");
// Decompress the file datas.txt.gz to datas.txt
// fs.createReadStream('datas.txt.gz')
//    .pipe(zlib.createGunzip())
//    .pipe(fs.createWriteStream('datas.txt'));
// console.log("File Decompressed.");
//--------------:File system write-------------------------------------------------
// console.log("Going to write into existing file");
// fs.writeFile('datas.txt', 'Simply Easy Learning by Hariom Gupta!',  function(err) {
//    if (err) {
//       return console.error(err);
//    }
//    console.log("Data written successfully!");
//    console.log("Let's read newly written data");
//    fs.readFile('datas.txt', function (err, data) {
//       if (err) {
//          return console.error(err);
//       }
//       console.log("Asynchronous read: " + data.toString());
//    });
// });
// //--------------:File System Delete-------------------------------------------------
// console.log("Going to delete an existing file");
// fs.unlink('datas.txt.gz', function(err) {
//    if (err) {
//       return console.error(err);
//    }
//    console.log("File deleted successfully!");
// });
//--------------:-------------------------------------------------
function printHello(){
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    console.log( "Hello, Dear, i'm bothering you!\n" + formatted);
 }
 // Now call above function after 2 seconds
var t = setTimeout(printHello, 22000);
clearTimeout(t);
// Now call above function after 2 seconds interval
setInterval(printHello, (1000*60*2));
//--------------:Child Processes-------------------------------------------------
const child_process = require('child_process');
console.log('--------------exec Method-----------------');
for(var i=0; i<3; i++) {
   var workerProcess = child_process.exec('node support.js '+i,function 
      (error, stdout, stderr) {
      if (error) {
         console.log(error.stack);
         console.log('* Error code: '+error.code);
         console.log('* Signal received: '+error.signal);
      }
      console.log('* stdout: ' + stdout);
      console.log('* stderr: ' + stderr);
   });
   workerProcess.on('exit', function (code) {
      console.log('** Child process exited with exit code '+code);
   });
}
console.log('--------------spawn Method-----------------');
for(var i = 0; i<3; i++) {
    var workerProcess = child_process.spawn('node', ['support.js', i]);
 
    workerProcess.stdout.on('data', function (data) {
       console.log('# stdout: ' + data);
    });
    workerProcess.stderr.on('data', function (data) {
       console.log('# stderr: ' + data);
    });
    workerProcess.on('close', function (code) {
       console.log('## child process exited with code ' + code);
    });
 }
 console.log('----------Fork Method---------------------');
 for(var i=0; i<3; i++) {
    var worker_process = child_process.fork("support.js", [i]);	
 
    worker_process.on('close', function (code) {
       console.log('@@ child process exited with code ' + code);
    });
 }
 //--------------:Child Processes-------------------------------------------------
