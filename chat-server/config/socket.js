var io = require('../bin/www/io');

var io = require('socket.io')(server);
var app = require('../app');
var debug = require('debug')('chat-server:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);

io.on('connection', (socket) => {
    console.log('new connection made');
  
  
    socket.on('join', function (data) {
      // Joining
      socket.join(data.room);
  
      console.log(data.name + ' joined the room : ' + data.room);
  
      socket.broadcast.to(data.room).emit('new user joined', { user: data.name, message: 'has joined this room.' });
    });
  
    socket.on('leave', function (data) {
  
      console.log(data.name + ' left the room : ' + data.room);
  
      socket.broadcast.to(data.room).emit('left room', { user: data.name, message: 'has left this room.' });
  
      socket.leave(data.room);
    });
  
    socket.on('message', function (data) {
      console.log('message emit triggered by ', data);
      io.in(data.chatRoom).emit('new message', { user: data.name, chatMessage: data.chatMessage, send_by: data.send_by, recieve_by: data.recieve_by });
    })
  
    socket.on('disconnect', () => {
      console.log('user has disconnected');
    })
  })
