(function () {
  'use strict';

  angular
    .module('quizzes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('quizzes', {
        abstract: true,
        url: '/quizzes',
        template: '<ui-view/>'
      })
      .state('quizzes.list', {
        url: '',
        templateUrl: 'modules/quizzes/client/views/list-quizzes.client.view.html',
        controller: 'QuizzesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Quizzes List'
        }
      })
      .state('quizzes.create', {
        url: '/create',
        templateUrl: 'modules/quizzes/client/views/form-quiz.client.view.html',
        controller: 'QuizzesController',
        controllerAs: 'vm',
        resolve: {
          quizResolve: newQuiz
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Quizzes Create'
        }
      })
      .state('quizzes.edit', {
        url: '/:quizId/edit',
        templateUrl: 'modules/quizzes/client/views/form-quiz.client.view.html',
        controller: 'QuizzesController',
        controllerAs: 'vm',
        resolve: {
          quizResolve: getQuiz
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Quiz {{ quizResolve.name }}'
        }
      })
      .state('quizzes.view', {
        url: '/:quizId',
        templateUrl: 'modules/quizzes/client/views/view-quiz.client.view.html',
        controller: 'QuizzesController',
        controllerAs: 'vm',
        resolve: {
          quizResolve: getQuiz
        },
        data: {
          pageTitle: 'Quiz {{ quizResolve.name }}'
        }
      });
  }

  getQuiz.$inject = ['$stateParams', 'QuizzesService'];

  function getQuiz($stateParams, QuizzesService) {
    return QuizzesService.get({
      quizId: $stateParams.quizId
    }).$promise;
  }

  newQuiz.$inject = ['QuizzesService'];

  function newQuiz(QuizzesService) {
    return new QuizzesService();
  }
}());
