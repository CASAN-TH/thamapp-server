(function () {
  'use strict';

  angular
    .module('quizzes')
    .controller('QuizzesListController', QuizzesListController);

  QuizzesListController.$inject = ['QuizzesService'];

  function QuizzesListController(QuizzesService) {
    var vm = this;

    vm.quizzes = QuizzesService.query();
  }
}());
