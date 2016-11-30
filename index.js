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
    console.log("got msg")
    //TODO ADD LOGIC
    //get /repos/MTRNord/ls-vertretungsplan-desktop/releases/latest

    try {
      fs.accessSync(path, fs.F_OK);

      findRemoveSync('cache.json', {age: {seconds: 3600}});
    } catch (e) {

    }

    fs.access('cache.json', fs.F_OK, function(err) {
      if (!err) {
        console.log("file exists");
        var release = jsonfile.readFileSync("cache.json")
        var version = release["tag_name"]
        var assets = release["assets"]
        x = 0;
        _.find(assets, function (key) {
          if (key["name"] == 'local') {
            var local_asset = key["name"]
            io.emit('AupdateStatus', 'local');
          }else {
            if (!x == assets.length) {
              console.log("not local");
              io.emit('AupdateStatus', 'NOTlocal');
            }
          }
          x + 1;
        })
      } else {
        console.log("aquire file");
        var options = {
          url: 'https://api.github.com/repos/MTRNord/ls-vertretungsplan-desktop/releases/latest',
          headers: {
            'User-Agent': 'ls-vertretungsplan'
          }
        };
        request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            jsonfile.writeFile("cache.json", body)
            var release = JSON.parse(body);
            var version = release["tag_name"]
            var assets = release["assets"]
            console.log("request made");
            console.log("Länge" + assets.length);
            _.find(assets, function (key) {
              if (key["name"] == 'local') {
                var local_asset = key["name"]
                io.emit('AupdateStatus', 'local');
              }else {
                if (_.findIndex(assets, key) == assets.length-1) {
                  console.log("not local");
                  io.emit('AupdateStatus', 'NOTlocal');
                }
                console.log("Länge X " + _.findIndex(assets, key));
              }
            })
          }else {
            console.log(response);
            console.error(error);
          }
        })
      }
    });
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
