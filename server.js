const express = require('express')
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
const {v4: uuidV4} = require('uuid')
var username=""
app.set('view engine', 'ejs') // Tell Express we are using EJS
app.use(express.static('public')) // Tell express to pull the client script from the public folder


app.set("view engine", "ejs");

app.get("/", (req, rsp) => {
  rsp.render("landing.ejs");
});
app.get("/createRoom/:username", (req, rsp) => {
  username = req.params.username
  rsp.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room, userName: username });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT || 3000);