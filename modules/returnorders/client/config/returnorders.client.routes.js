(function () {
  'use strict';

  angular
    .module('returnorders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('returndeliver', {
        url: '/returndeliver',
        templateUrl: 'modules/returnorders/client/views/returndeliver.client.view.html',
        controller: 'ReturndeliverController',
        controllerAs: 'vm'
      })
      .state('returnresponse', {
        url: '/returnresponse',
        templateUrl: 'modules/returnorders/client/views/returnresponse.client.view.html',
        controller: 'ReturnresponseController',
        controllerAs: 'vm'
      })
      .state('returnorders', {
        abstract: true,
        url: '/returnorders',
        template: '<ui-view/>'
      })
      .state('returnorders.list', {
        url: '',
        templateUrl: 'modules/returnorders/client/views/list-returnorders.client.view.html',
        controller: 'ReturnordersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Returnorders List'
        }
      })
      .state('returnorders.create', {
        url: '/create',
        templateUrl: 'modules/returnorders/client/views/form-returnorder.client.view.html',
        controller: 'ReturnordersController',
        controllerAs: 'vm',
        resolve: {
          returnorderResolve: newReturnorder
        },
        data: {
          roles: ['deliver', 'admin'],
          pageTitle: 'Returnorders Create'
        }
      })
      .state('returnorders.edit', {
        url: '/:returnorderId/edit',
        templateUrl: 'modules/returnorders/client/views/form-returnorder.client.view.html',
        controller: 'ReturnordersController',
        controllerAs: 'vm',
        resolve: {
          returnorderResolve: getReturnorder
        },
        data: {
          roles: ['deliver', 'admin'],
          pageTitle: 'Edit Returnorder {{ returnorderResolve.name }}'
        }
      })
      .state('returnorders.view', {
        url: '/:returnorderId',
        templateUrl: 'modules/returnorders/client/views/view-returnorder.client.view.html',
        controller: 'ReturnordersController',
        controllerAs: 'vm',
        resolve: {
          returnorderResolve: getReturnorder
        },
        data: {
          pageTitle: 'Returnorder {{ returnorderResolve.name }}'
        }
      });
  }

  getReturnorder.$inject = ['$stateParams', 'ReturnordersService'];

  function getReturnorder($stateParams, ReturnordersService) {
    return ReturnordersService.get({
      returnorderId: $stateParams.returnorderId
    }).$promise;
  }

  newReturnorder.$inject = ['ReturnordersService'];

  function newReturnorder(ReturnordersService) {
    return new ReturnordersService();
  }
}());
