'use strict'

var express = require('express');
var app = express();
var mcache = require('memory-cache');

app.set('view engine', 'pug');

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

app.get('/', cache(10), (req, res) => {
  setTimeout(() => {
    res.render('index', {date: new Date()})
  }, 5000) //setTimeout was used to simulate a slow processing request
})

app.get('/user/:id', cache(10), (req, res) => {
  setTimeout(() => {
    if (req.params.id == 1) {
      res.json({ id: 1, name: "James"})
    } else if (req.params.id == 2) {
      res.json({ id: 2, name: "Becky"})
    } else if (req.params.id == 3) {
      res.json({ id: 3, name: "Lucy"})
    }
  }, 3000) //setTimeout was used to simulate a slow processing request
})

app.use((req, res) => {
  res.status(404).send('') //not found
})

var server = app.listen(3000, function (){
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});

console.log("app.listen() executed.");