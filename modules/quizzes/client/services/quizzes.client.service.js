// Quizzes service used to communicate Quizzes REST endpoints
(function () {
  'use strict';

  angular
    .module('quizzes')
    .factory('QuizzesService', QuizzesService);

  QuizzesService.$inject = ['$resource'];

  function QuizzesService($resource) {
    return $resource('api/quizzes/:quizId', {
      quizId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
