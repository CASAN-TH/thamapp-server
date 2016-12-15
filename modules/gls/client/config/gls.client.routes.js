(function () {
  'use strict';

  angular
    .module('gls')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('experimental-budget', {
        url: '/:glId/experimental-budget',
        templateUrl: 'modules/gls/client/views/experimental-budget.client.view.html',
        controller: 'ExperimentalBudgetController',
        controllerAs: 'vm',
        resolve: {
          glResolve: getGl
        }
      })
      .state('ledger', {
        url: '/:glId/ledger',
        templateUrl: 'modules/gls/client/views/ledger.client.view.html',
        controller: 'LedgerController',
        controllerAs: 'vm',
        resolve: {
          glResolve: getGl
        }
      })
      .state('gls', {
        abstract: true,
        url: '/gls',
        template: '<ui-view/>'
      })
      .state('gls.list', {
        url: '',
        templateUrl: 'modules/gls/client/views/list-gls.client.view.html',
        controller: 'GlsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Gls List'
        }
      })
      .state('gls.create', {
        url: '/create',
        templateUrl: 'modules/gls/client/views/form-gl.client.view.html',
        controller: 'GlsController',
        controllerAs: 'vm',
        resolve: {
          glResolve: newGl
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Gls Create'
        }
      })
      .state('gls.edit', {
        url: '/:glId/edit',
        templateUrl: 'modules/gls/client/views/form-gl.client.view.html',
        controller: 'GlsController',
        controllerAs: 'vm',
        resolve: {
          glResolve: getGl
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Gl {{ glResolve.name }}'
        }
      })
      .state('gls.view', {
        url: '/:glId',
        templateUrl: 'modules/gls/client/views/view-gl.client.view.html',
        controller: 'GlsController',
        controllerAs: 'vm',
        resolve: {
          glResolve: getGl
        },
        data: {
          pageTitle: 'Gl {{ glResolve.name }}'
        }
      });
  }

  getGl.$inject = ['$stateParams', 'GlsService'];

  function getGl($stateParams, GlsService) {
    return GlsService.get({
      glId: $stateParams.glId
    }).$promise;
  }

  newGl.$inject = ['GlsService'];

  function newGl(GlsService) {
    return new GlsService();
  }
} ());
