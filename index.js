var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var jsonfile = require('jsonfile')
var findRemoveSync = require('find-remove');
var fs = require('fs');
var _ = require('lodash')
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('RupdateStatus', function(msg){
    //TODO ADD LOGIC
    //get /repos/MTRNord/ls-vertretungsplan-desktop/releases/latest

    findRemoveSync('cache.json', {age: {seconds: 3600}});
    try {
      fs.statSync('cache.json').isFile()

      var release = jsonfile.readFileSync("cache.json")
      var version = release["tag_name"]
      var assets = release["assets"]
    } catch (e) {
      request('https://api.github.com/repos/MTRNord/ls-vertretungsplan-desktop/releases/latest', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          jsonfile.writeFileSync("cache.json", body)
        }
      })
      var release = jsonfile.readFileSync("cache.json")
      var version = release["tag_name"]
      var assets = release["assets"]
      _.find(assets, function (key) {
        if (assets[key]["name"] == local) {
          var local_asset = assets[key]["name"]
          console.log(release);
        }
      })
    }

    io.emit('AupdateStatus', 'local');
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
