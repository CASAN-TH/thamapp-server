(function () {
  'use strict';

  angular
    .module('marketplans')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('marketplans', {
        abstract: true,
        url: '/marketplans',
        template: '<ui-view/>'
      })
      .state('marketplans.list', {
        url: '',
        templateUrl: 'modules/marketplans/client/views/list-marketplans.client.view.html',
        controller: 'MarketplansListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Marketplans List'
        }
      })
      .state('marketplans.create', {
        url: '/create',
        templateUrl: 'modules/marketplans/client/views/form-marketplan.client.view.html',
        controller: 'MarketplansController',
        controllerAs: 'vm',
        resolve: {
          marketplanResolve: newMarketplan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Marketplans Create'
        }
      })
      .state('marketplans.edit', {
        url: '/:marketplanId/edit',
        templateUrl: 'modules/marketplans/client/views/form-marketplan.client.view.html',
        controller: 'MarketplansController',
        controllerAs: 'vm',
        resolve: {
          marketplanResolve: getMarketplan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Marketplan {{ marketplanResolve.name }}'
        }
      })
      .state('marketplans.view', {
        url: '/:marketplanId',
        templateUrl: 'modules/marketplans/client/views/view-marketplan.client.view.html',
        controller: 'MarketplansController',
        controllerAs: 'vm',
        resolve: {
          marketplanResolve: getMarketplan
        },
        data: {
          pageTitle: 'Marketplan {{ marketplanResolve.name }}'
        }
      });
  }

  getMarketplan.$inject = ['$stateParams', 'MarketplansService'];

  function getMarketplan($stateParams, MarketplansService) {
    return MarketplansService.get({
      marketplanId: $stateParams.marketplanId
    }).$promise;
  }

  newMarketplan.$inject = ['MarketplansService'];

  function newMarketplan(MarketplansService) {
    return new MarketplansService();
  }
}());
