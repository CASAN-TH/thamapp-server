(function () {
  'use strict';

  angular
    .module('quizzes')
    .controller('QuizzesListController', QuizzesListController);

  QuizzesListController.$inject = ['QuizzesService', '$window', 'Authentication'];

  function QuizzesListController(QuizzesService, $window, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.quizzes = QuizzesService.query();


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
