'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$state', '$location', 'Authentication', 'Socket', 'Admin', 'ChatroomsService',
  function ($scope, $state, $location, Authentication, Socket, Admin, ChatroomsService) {
    // Create a messages array
    $scope.authenID = Authentication.user._id;
    $scope.username = Authentication.user.displayName;
    $scope.messages = [];
    Admin.query(function (data) {
      $scope.users = data;
    });
    $scope.chatlist = ChatroomsService.query();
    // $scope.userSelect = $scope.userSelect ? $scope.userSelect : {};
    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }
    $scope.createGroup = function (user) {
      $scope.userSelect = user;

      var data = {
        name: Authentication.user.username + '' + user.username,
        type: 'P',
        users: [Authentication.user, user],
        user: Authentication.user
      };
      Socket.emit('createroom', data);

    };

    // Add an event listener to the 'invite' event
    Socket.on('invite', function (data) {
      $scope.chatlist = ChatroomsService.query();
      //console.log('invite : ' + data);
      Socket.emit('join', data);
    });

    // Add an event listener to the 'joinsuccess' event
    Socket.on('joinsuccess', function (data) {
      $scope.room = data;
      console.log('joinsuccess : ' + data);
      // data.text = 'hello';
      // Socket.emit('chatMessage', data);
    });

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (data) {
      //$scope.chatlist = ChatroomsService.query();
      $scope.room = data;
    });

    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // Create a new message object
      // var message = {
      //   text: this.messageText
      // };
      //$scope.room.text = this.messageText;
      if ($scope.room && $scope.room.messages.length === 0) {
        $scope.room.messages = [];
        $scope.room.messages.unshift({
          type: 'message',
          created: Date.now(),
          profileImageURL: Authentication.user.profileImageURL,
          username: Authentication.user.displayName,
          text: this.messageText
        });
      } else {
        $scope.room.messages.unshift({
          type: 'message',
          created: Date.now(),
          profileImageURL: Authentication.user.profileImageURL,
          username: Authentication.user.displayName,
          text: this.messageText
        });
      }


      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', $scope.room);

      // Clear the message text
      this.messageText = '';
    };
    $scope.roomsername = function (data) {
      Socket.emit('createroom', data);
      //$scope.room = data;
      if ($scope.room) {
        if (data.name !== $scope.room.name) {
          $scope.room = data;
        }
      } else {
        $scope.room = data;
      }
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
  }
]);
