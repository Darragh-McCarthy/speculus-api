const { app, connect } = require("./app");
const port = process.env.PORT || 3000;

connect()
  .then(async connection => {
    app.listen(port);
  })
  .catch(e => console.log(e));
