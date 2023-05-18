const http = require("http");
const app = require("./app");
const port = "6000";
const server = http.createServer(app);

app.get('/',(req,res)=>{
  res.send('hello world');
})

app.listen(port, () => {
  console.log("port:", port);
});
