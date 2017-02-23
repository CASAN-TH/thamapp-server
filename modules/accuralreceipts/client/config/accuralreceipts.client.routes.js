(function () {
  'use strict';

  angular
    .module('accuralreceipts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ar', {
        url: '/ar',
        templateUrl: 'modules/accuralreceipts/client/views/ar.client.view.html',
        controller: 'ArController',
        controllerAs: 'vm'
      })
      .state('accuralreceipts', {
        abstract: true,
        url: '/accuralreceipts',
        template: '<ui-view/>'
      })
      .state('accuralreceipts.list', {
        url: '',
        templateUrl: 'modules/accuralreceipts/client/views/list-accuralreceipts.client.view.html',
        controller: 'AccuralreceiptsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Accuralreceipts List'
        }
      })
      .state('accuralreceipts.create', {
        url: '/create',
        templateUrl: 'modules/accuralreceipts/client/views/form-accuralreceipt.client.view.html',
        controller: 'AccuralreceiptsController',
        controllerAs: 'vm',
        resolve: {
          accuralreceiptResolve: newAccuralreceipt
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Accuralreceipts Create'
        }
      })
      .state('accuralreceipts.edit', {
        url: '/:accuralreceiptId/edit',
        templateUrl: 'modules/accuralreceipts/client/views/form-accuralreceipt.client.view.html',
        controller: 'AccuralreceiptsController',
        controllerAs: 'vm',
        resolve: {
          accuralreceiptResolve: getAccuralreceipt
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Accuralreceipt {{ accuralreceiptResolve.name }}'
        }
      })
      .state('accuralreceipts.view', {
        url: '/:accuralreceiptId',
        templateUrl: 'modules/accuralreceipts/client/views/view-accuralreceipt.client.view.html',
        controller: 'AccuralreceiptsController',
        controllerAs: 'vm',
        resolve: {
          accuralreceiptResolve: getAccuralreceipt
        },
        data: {
          pageTitle: 'Accuralreceipt {{ accuralreceiptResolve.name }}'
        }
      });
  }

  getAccuralreceipt.$inject = ['$stateParams', 'AccuralreceiptsService'];

  function getAccuralreceipt($stateParams, AccuralreceiptsService) {
    return AccuralreceiptsService.get({
      accuralreceiptId: $stateParams.accuralreceiptId
    }).$promise;
  }

  newAccuralreceipt.$inject = ['AccuralreceiptsService'];

  function newAccuralreceipt(AccuralreceiptsService) {
    return new AccuralreceiptsService();
  }
}());
