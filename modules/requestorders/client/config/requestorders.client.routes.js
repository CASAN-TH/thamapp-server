(function () {
  'use strict';

  angular
    .module('requestorders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('responseorder', {
        url: '/responseorder',
        templateUrl: 'modules/requestorders/client/views/responseorder.client.view.html',
        controller: 'ResponseorderController',
        controllerAs: 'vm'
      })
      .state('receivedorder', {
        url: '/receivedorder',
        templateUrl: 'modules/requestorders/client/views/receivedorder.client.view.html',
        controller: 'ReceivedorderController',
        controllerAs: 'vm'
      })
      .state('requestorders', {
        abstract: true,
        url: '/requestorders',
        template: '<ui-view/>'
      })
      .state('requestorders.list', {
        url: '',
        templateUrl: 'modules/requestorders/client/views/list-requestorders.client.view.html',
        controller: 'RequestordersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Requestorders List'
        }
      })
      .state('requestorders.create', {
        url: '/create',
        templateUrl: 'modules/requestorders/client/views/form-requestorder.client.view.html',
        controller: 'RequestordersController',
        controllerAs: 'vm',
        resolve: {
          requestorderResolve: newRequestorder
        },
        data: {
          roles: ['deliver', 'admin'],
          pageTitle: 'Requestorders Create'
        }
      })
      .state('requestorders.edit', {
        url: '/:requestorderId/edit',
        templateUrl: 'modules/requestorders/client/views/form-requestorder.client.view.html',
        controller: 'RequestordersController',
        controllerAs: 'vm',
        resolve: {
          requestorderResolve: getRequestorder
        },
        data: {
          roles: ['deliver', 'admin'],
          pageTitle: 'Edit Requestorder {{ requestorderResolve.name }}'
        }
      })
      .state('requestorders.view', {
        url: '/:requestorderId',
        templateUrl: 'modules/requestorders/client/views/view-requestorder.client.view.html',
        controller: 'RequestordersController',
        controllerAs: 'vm',
        resolve: {
          requestorderResolve: getRequestorder
        },
        data: {
          pageTitle: 'Requestorder {{ requestorderResolve.name }}'
        }
      });
  }

  getRequestorder.$inject = ['$stateParams', 'RequestordersService'];

  function getRequestorder($stateParams, RequestordersService) {
    return RequestordersService.get({
      requestorderId: $stateParams.requestorderId
    }).$promise;
  }

  newRequestorder.$inject = ['RequestordersService'];

  function newRequestorder(RequestordersService) {
    return new RequestordersService();
  }
}());