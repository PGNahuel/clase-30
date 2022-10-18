const express = require("express");
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

const app = express();

//app.use(express.static('public'))

const PORT = 8081;

if(cluster.isPrimary){
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++){
    cluster.fork();
  }

  app.get("/api/randoms",(req,res)=>{
    res.send({num_random: Math.random() * 1000});
  });

  app.listen(8081, () => {
    console.log(`Servidor express escuchando en el puerto ${8081}`);
  });

  cluster.on("exit",(worker,code, signal)=>{
    console.log(`worker ${worker.process.pid} died`);
  });
}else{
  app.get("/api/randoms",(req,res)=>{
    res.send({num_random: Math.random() * 1000});
  });


  app.get("/datos", (req, res) => {
    console.log(`port: ${8080} -> Fyh: ${Date.now()}`);
    res.send(
      `Servidor express <span style="color:blueviolet;">(Nginx)</span> en ${8080} - <b>PID ${
        process.pid
      }</b> - ${new Date().toLocaleString()}`
    );
  });

  app.get('/info',(req,res)=>{
    res.send({numCPUs: numCPUs});
  });

  app.listen(8080, () => {
    console.log(`Servidor express escuchando en el puerto ${8080}`);
  });

  console.log(`Worker ${process.pid} started`);
}
