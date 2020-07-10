const express = require('express');
const userRouter = require("./users/userRouter")
const postRouter = require("./posts/postRouter")
const server = express();

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/users", userRouter)
server.use("/api/users/:id/posts", postRouter)

//custom middleware

function logger(req, res, next) {
  console.log(Date.now(), req.method, req.url)

  next()
}

module.exports = server;
