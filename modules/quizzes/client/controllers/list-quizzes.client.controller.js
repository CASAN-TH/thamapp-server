(function () {
  'use strict';

  angular
    .module('quizzes')
    .controller('QuizzesListController', QuizzesListController);

  QuizzesListController.$inject = ['QuizzesService', '$window', 'Authentication', '$state'];

  function QuizzesListController(QuizzesService, $window, Authentication, $state) {
    var vm = this;
    vm.authentication = Authentication;
    vm.quizzes = QuizzesService.query();

    function arrayObjectIndexOf(myArray, searchTerm, property) {
      for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
      }
      return -1;
    }

    vm.isNever = function (itm) {
      // alert(itm.users);
      // alert(arrayObjectIndexOf(itm.users, vm.authentication.user, '_id') === -1);
        return arrayObjectIndexOf(itm.users, vm.authentication.user._id, '_id') === -1;
    };

    vm.remove = function (itm) {
      if ($window.confirm('คุณต้องการลบคำถามนี้ ?')) {
        itm.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.quizzes = QuizzesService.query();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
  }
}());
