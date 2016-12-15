(function () {
  'use strict';

  angular
    .module('receivings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('receivings', {
        abstract: true,
        url: '/receivings',
        template: '<ui-view/>'
      })
      .state('receivings.list', {
        url: '',
        templateUrl: 'modules/receivings/client/views/list-receivings.client.view.html',
        controller: 'ReceivingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Receivings List'
        }
      })
      .state('receivings.create', {
        url: '/create',
        templateUrl: 'modules/receivings/client/views/form-receiving.client.view.html',
        controller: 'ReceivingsController',
        controllerAs: 'vm',
        resolve: {
          receivingResolve: newReceiving
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Receivings Create'
        }
      })
      .state('receivings.edit', {
        url: '/:receivingId/edit',
        templateUrl: 'modules/receivings/client/views/form-receiving.client.view.html',
        controller: 'ReceivingsController',
        controllerAs: 'vm',
        resolve: {
          receivingResolve: getReceiving
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Receiving {{ receivingResolve.name }}'
        }
      })
      .state('receivings.view', {
        url: '/:receivingId',
        templateUrl: 'modules/receivings/client/views/view-receiving.client.view.html',
        controller: 'ReceivingsController',
        controllerAs: 'vm',
        resolve: {
          receivingResolve: getReceiving
        },
        data: {
          pageTitle: 'Receiving {{ receivingResolve.name }}'
        }
      });
  }

  getReceiving.$inject = ['$stateParams', 'ReceivingsService'];

  function getReceiving($stateParams, ReceivingsService) {
    return ReceivingsService.get({
      receivingId: $stateParams.receivingId
    }).$promise;
  }

  newReceiving.$inject = ['ReceivingsService'];

  function newReceiving(ReceivingsService) {
    return new ReceivingsService();
  }
}());
