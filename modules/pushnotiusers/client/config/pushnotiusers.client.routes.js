(function () {
  'use strict';

  angular
    .module('pushnotiusers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pushnotiusers', {
        abstract: true,
        url: '/pushnotiusers',
        template: '<ui-view/>'
      })
      .state('pushnotiusers.list', {
        url: '',
        templateUrl: 'modules/pushnotiusers/client/views/list-pushnotiusers.client.view.html',
        controller: 'PushnotiusersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pushnotiusers List'
        }
      })
      .state('pushnotiusers.create', {
        url: '/create',
        templateUrl: 'modules/pushnotiusers/client/views/form-pushnotiuser.client.view.html',
        controller: 'PushnotiusersController',
        controllerAs: 'vm',
        resolve: {
          pushnotiuserResolve: newPushnotiuser
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pushnotiusers Create'
        }
      })
      .state('pushnotiusers.edit', {
        url: '/:pushnotiuserId/edit',
        templateUrl: 'modules/pushnotiusers/client/views/form-pushnotiuser.client.view.html',
        controller: 'PushnotiusersController',
        controllerAs: 'vm',
        resolve: {
          pushnotiuserResolve: getPushnotiuser
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Pushnotiuser {{ pushnotiuserResolve.name }}'
        }
      })
      .state('pushnotiusers.view', {
        url: '/:pushnotiuserId',
        templateUrl: 'modules/pushnotiusers/client/views/view-pushnotiuser.client.view.html',
        controller: 'PushnotiusersController',
        controllerAs: 'vm',
        resolve: {
          pushnotiuserResolve: getPushnotiuser
        },
        data: {
          pageTitle: 'Pushnotiuser {{ pushnotiuserResolve.name }}'
        }
      });
  }

  getPushnotiuser.$inject = ['$stateParams', 'PushnotiusersService'];

  function getPushnotiuser($stateParams, PushnotiusersService) {
    return PushnotiusersService.get({
      pushnotiuserId: $stateParams.pushnotiuserId
    }).$promise;
  }

  newPushnotiuser.$inject = ['PushnotiusersService'];

  function newPushnotiuser(PushnotiusersService) {
    return new PushnotiusersService();
  }
}());
