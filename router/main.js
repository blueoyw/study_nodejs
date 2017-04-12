//module 생성
module.exports = function(app, fs)
{
  app.get('/', function( req, res){
    //res.render('index.html');
    var sess =req.session;
    res.render('index', {
      title: 'MY HOME',
      length: 5,
      name : sess.name,
      username : sess.username
    })
  });

  app.get('/login/:username/:password', function (req, res) {
    var sess = req.session;

    fs.readFile( __dirname+ "/../data/" + "user.json", "utf8", function(err, data) {
      var users = JSON.parse(data);
      var username = req.params.username;
      var password = req.params.password;
      var result = {};
      if( !users[username] ) {
        result["success"] = 0;
        result["error"] = "not found";
        res.json(result);
        return;
      }

      if( users[username]["password"] == password ) {
        result["success"] = 1;
        sess.username = username;
        sess.name = users[username]["name"];
        res.json(result);
      } else {
        result["success"] = 0;
        result["error"] = "incorrect";
        res.json(result);
        return;
      }
    });
  });

  app.get('/logout', function(req, res) {
    sess =req.session;
    if( sess.username ) {
      req.session.destroy( function(err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/');
    }
  });

  app.get('/list', function(req, res ) {
    fs.readFile( __dirname+ "/../data/" + "user.json", "utf8", function(err, data) {
      console.log(data);
      res.end(data);  //아무런 data 없이 reponse하고 연결을 끊음.
    });
  });

  app.get('/getUser/:username', function( req, res) {
    fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function(err, data) {
      var users = JSON.parse(data);   //JSON parsing
      res.json( users[req.params.username] ); //json 형태로 response
    });
  });

  app.post('/addUser/:username', function( req, res ) {
    var result = {};
    var username = req.params.username;

    // CHECK REQ VALIDATE
    if( !req.body["password"] || !req.body["name"] ) {
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }

    // LOAD DATA & CHECK DUPLICATION
    fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function(err, data) {
      var users = JSON.parse(data);
      if( users[username] ) {
        // DUPLICATION FOUND
        result["success"] = 0;
        result["error"] = "duplicate";
        res.json(result);
        return;
      }


      // ADD TO data
      users[username] = req.body;

      fs.writeFile( __dirname + "/../data/" + "user.json"
                    , JSON.stringify(users, null, '\t') //pretty
                    , 'utf8'
                    , function( err, data ) {
                      result = {"success": 1};
                      res.json(result);
                    });

    });

  });

  app.put('/updateUser/:username', function(req, res) {
    var result = {};
    var username = req.params.username;

    // CHECK REQ VALIDATE
    if( !req.body["password"] || !req.body["name"] ) {
      result["success"] = 0;
      result["error"] = "invalid request";
      res.json(result);
      return;
    }

    fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function(err, data) {
      var users = JSON.parse(data);
      if( !users[username]) {
        result["success"] = 0;
        result["error"] = "NONE";
        res.json(result);
        return;
      }
      users[username] = req.body;
      fs.writeFile( __dirname + "/../data/" + "user.json"
                    , JSON.stringify(users, null, '\t') //pretty
                    , 'utf8'
                    , function( err, data ) {
                      result = {"success": 1};
                      res.json(result);
                    });
    });
  });

  app.delete( '/deleteUser/:username', function(req, res) {
      var result = {};
      var username = req.params.username;

      fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function(err, data) {
        var users = JSON.parse(data);
        if( !users[username]) {
          result["success"] = 0;
          result["error"] = "NONE";
          res.json(result);
          return;
        }

        delete users[username];
        fs.writeFile( __dirname + "/../data/" + "user.json"
                      , JSON.stringify(users, null, '\t') //pretty
                      , 'utf8'
                      , function( err, data ) {
                        result = {"success": 1};
                        res.json(result);
                      });
      });


  });



  /*
  app.get('/about', function( req, res){
    //res.render('about.html');
  });
  */
}
