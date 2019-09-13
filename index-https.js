var fs = require("fs");
var https = require("https");
const { app, connect } = require("./app");
const port = process.env.PORT || 3000;

app.get("/", function(req, res) {
  res.send("hello world");
});

connect()
  .then(async connection => {
    https
      .createServer(
        {
          key: fs.readFileSync("speculus.localhost+4-key.pem"),
          cert: fs.readFileSync("speculus.localhost+4.pem")
        },
        app
      )
      .listen(port, function() {
        console.log("serving from https://localhost:3000/");
      });
  })
  .catch(e => console.log(e));
