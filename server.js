const http = require("http");
const app = require("./app");
const port = "6000";
const server = http.createServer(app);
app.listen(port, () => {
  console.log("port:", port);
});
