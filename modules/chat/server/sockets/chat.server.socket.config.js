'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Chatroom = mongoose.model('Chatroom'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  // io.emit('chatMessage', {
  //   type: 'status',
  //   text: 'Is now connected',
  //   created: Date.now(),
  //   profileImageURL: socket.request.user.profileImageURL,
  //   username: socket.request.user.username
  // });

  socket.join(socket.request.user.username);

  // create room
  socket.on('createroom', function (data) {
    console.log('-------------------------------------- createroom Data : ' + data);
    var chatroom = new Chatroom(data);
    chatroom.user = socket.request.user;

    Chatroom.find({ name: data.name }).populate('user', 'displayName').populate('users').exec(function (err, chat) {
      if (chat[0]) {
        console.log('---------------------------------------------- invite success have data');
        data._id = chat[0]._id;
        chat[0].users.forEach(function (user) {
          // console.log('success' + JSON.stringify(chatroom));
          // console.log(JSON.stringify(user));
          io.sockets.in(user.username).emit('invite', chat[0]);
        });
      } else {
        chatroom.save(function (err) {
          if (err) {
            console.log('---------------------------------------------- save error not data');
            // return res.status(400).send({
            //   message: errorHandler.getErrorMessage(err)
            // });
            // console.log('error : ' + JSON.stringify(err));
          } else {
            console.log('---------------------------------------------- invite success not data');

            //console.log('success' + JSON.stringify(chatroom));
            data._id = chatroom._id;
            data.users.forEach(function (user) {
              // console.log('success' + JSON.stringify(chatroom));
              // console.log(JSON.stringify(user));
              io.sockets.in(user.username).emit('invite', data);
            });
            // res.jsonp(chatroom);
          }
        });
      }
    });
  });


  socket.on('join', function (data) {
    // console.log('join : ' + JSON.stringify(data));
    socket.join(data.name);
    io.sockets.in(data.name).emit('joinsuccess', data);
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (data) {
    // console.log('chatMessage : ' + JSON.stringify(message));
    socket.join(data.name);

    //io.sockets.in(data.name).emit('chatMessage', data);

    Chatroom.findById(data._id).populate('user', 'displayName').exec(function (err, chatroom) {
      if (err) {
        console.log(err);
      } else if (!chatroom) {
        console.log('Chatroom is invalid');
      } else if (chatroom) {
        chatroom.messages = data.messages;

        chatroom.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            // Emit the 'chatMessage' event

          }
        });

        io.sockets.in(data.name).emit('chatMessage', data);
      }
    });



    // message.type = 'message';
    // message.created = Date.now();
    // message.profileImageURL = socket.request.user.profileImageURL;
    // message.username = socket.request.user.username;


  });

  // Emit the status event when a socket client is disconnected
  // socket.on('disconnect', function () {
  //   io.emit('chatMessage', {
  //     type: 'status',
  //     text: 'disconnected',
  //     created: Date.now(),
  //     username: socket.request.user.username
  //   });
  // });
};
