var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

io.on('RupdateStatus', function(socket){
  //TODO ADD LOGIC



  io.emit('AupdateStatus', 'local');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
