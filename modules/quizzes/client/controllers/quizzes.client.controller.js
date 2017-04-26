(function () {
  'use strict';

  // Quizzes controller
  angular
    .module('quizzes')
    .controller('QuizzesController', QuizzesController);

  QuizzesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'quizResolve'];

  function QuizzesController($scope, $state, $window, Authentication, quiz) {
    var vm = this;

    vm.authentication = Authentication;
    vm.quiz = quiz;
    if (!vm.quiz._id) {
      vm.quiz.quizs = [];
    }

    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addtopic = addtopic;
    vm.addchoice = addchoice;
    vm.deletechoice = deletechoice;
    vm.deleteQuiz = deleteQuiz;
    $scope.type = false;
    vm.question = '';
    vm.questiontype = 'choice';

    function deleteQuiz(quiz) {
      var index = vm.quiz.quizs.indexOf(quiz);
      vm.quiz.quizs.splice(index, 1);
    }

    function addtopic() {
      if (vm.question !== '') {
        vm.quiz.quizs.push({
          question: vm.question,
          questiontype: vm.questiontype

        });
        vm.question = '';
        vm.questiontype = 'choice';
      }
    }

    function addchoice(quiz) {
      console.log(quiz);
      quiz.choices = quiz.choices ? quiz.choices : [];
      quiz.choices.push({
        choice: ''
      });
    }

    function deletechoice(quiz, choice) {
      vm.quiz.quizs.forEach(function (itm) {
        if (quiz === itm) {
          var index = itm.choices.indexOf(choice);
          itm.choices.splice(index, 1);
        }
      });
    }

    // Remove existing Quiz
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.quiz.$remove($state.go('quizzes.list'));
      }
    }

    // Save Quiz
    function save(isValid) {
      console.log(vm.quiz.quizs);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.quizForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.quiz._id) {
        vm.quiz.$update(successCallback, errorCallback);
      } else {
        vm.quiz.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('quizzes.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
