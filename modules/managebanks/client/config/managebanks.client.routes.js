(function () {
  'use strict';

  angular
    .module('managebanks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('managebanks', {
        abstract: true,
        url: '/managebanks',
        template: '<ui-view/>'
      })
      .state('managebanks.list', {
        url: '',
        templateUrl: 'modules/managebanks/client/views/list-managebanks.client.view.html',
        controller: 'ManagebanksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Managebanks List'
        }
      })
      .state('managebanks.create', {
        url: '/create',
        templateUrl: 'modules/managebanks/client/views/form-managebank.client.view.html',
        controller: 'ManagebanksController',
        controllerAs: 'vm',
        resolve: {
          managebankResolve: newManagebank
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Managebanks Create'
        }
      })
      .state('managebanks.edit', {
        url: '/:managebankId/edit',
        templateUrl: 'modules/managebanks/client/views/form-managebank.client.view.html',
        controller: 'ManagebanksController',
        controllerAs: 'vm',
        resolve: {
          managebankResolve: getManagebank
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Managebank {{ managebankResolve.name }}'
        }
      })
      .state('managebanks.view', {
        url: '/:managebankId',
        templateUrl: 'modules/managebanks/client/views/view-managebank.client.view.html',
        controller: 'ManagebanksController',
        controllerAs: 'vm',
        resolve: {
          managebankResolve: getManagebank
        },
        data: {
          pageTitle: 'Managebank {{ managebankResolve.name }}'
        }
      });
  }

  getManagebank.$inject = ['$stateParams', 'ManagebanksService'];

  function getManagebank($stateParams, ManagebanksService) {
    return ManagebanksService.get({
      managebankId: $stateParams.managebankId
    }).$promise;
  }

  newManagebank.$inject = ['ManagebanksService'];

  function newManagebank(ManagebanksService) {
    return new ManagebanksService();
  }
}());
