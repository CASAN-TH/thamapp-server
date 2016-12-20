(function () {
  'use strict';

  angular
    .module('postcodes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('postcodes', {
        abstract: true,
        url: '/postcodes',
        template: '<ui-view/>'
      })
      .state('postcodes.list', {
        url: '',
        templateUrl: 'modules/postcodes/client/views/list-postcodes.client.view.html',
        controller: 'PostcodesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Postcodes List'
        }
      })
      .state('postcodes.create', {
        url: '/create',
        templateUrl: 'modules/postcodes/client/views/form-postcode.client.view.html',
        controller: 'PostcodesController',
        controllerAs: 'vm',
        resolve: {
          postcodeResolve: newPostcode
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Postcodes Create'
        }
      })
      .state('postcodes.edit', {
        url: '/:postcodeId/edit',
        templateUrl: 'modules/postcodes/client/views/form-postcode.client.view.html',
        controller: 'PostcodesController',
        controllerAs: 'vm',
        resolve: {
          postcodeResolve: getPostcode
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Postcode {{ postcodeResolve.name }}'
        }
      })
      .state('postcodes.view', {
        url: '/:postcodeId',
        templateUrl: 'modules/postcodes/client/views/view-postcode.client.view.html',
        controller: 'PostcodesController',
        controllerAs: 'vm',
        resolve: {
          postcodeResolve: getPostcode
        },
        data: {
          pageTitle: 'Postcode {{ postcodeResolve.name }}'
        }
      });
  }

  getPostcode.$inject = ['$stateParams', 'PostcodesService'];

  function getPostcode($stateParams, PostcodesService) {
    return PostcodesService.get({
      postcodeId: $stateParams.postcodeId
    }).$promise;
  }

  newPostcode.$inject = ['PostcodesService'];

  function newPostcode(PostcodesService) {
    return new PostcodesService();
  }
}());
