(function () {
  'use strict';

  angular
    .module('promotions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('promotions', {
        abstract: true,
        url: '/promotions',
        template: '<ui-view/>'
      })
      .state('promotions.list', {
        url: '',
        templateUrl: 'modules/promotions/client/views/list-promotions.client.view.html',
        controller: 'PromotionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Promotions List'
        }
      })
      .state('promotions.create', {
        url: '/create',
        templateUrl: 'modules/promotions/client/views/form-promotion.client.view.html',
        controller: 'PromotionsController',
        controllerAs: 'vm',
        resolve: {
          promotionResolve: newPromotion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Promotions Create'
        }
      })
      .state('promotions.edit', {
        url: '/:promotionId/edit',
        templateUrl: 'modules/promotions/client/views/form-promotion.client.view.html',
        controller: 'PromotionsController',
        controllerAs: 'vm',
        resolve: {
          promotionResolve: getPromotion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Promotion {{ promotionResolve.name }}'
        }
      })
      .state('promotions.view', {
        url: '/:promotionId',
        templateUrl: 'modules/promotions/client/views/view-promotion.client.view.html',
        controller: 'PromotionsController',
        controllerAs: 'vm',
        resolve: {
          promotionResolve: getPromotion
        },
        data: {
          pageTitle: 'Promotion {{ promotionResolve.name }}'
        }
      });
  }

  getPromotion.$inject = ['$stateParams', 'PromotionsService'];

  function getPromotion($stateParams, PromotionsService) {
    return PromotionsService.get({
      promotionId: $stateParams.promotionId
    }).$promise;
  }

  newPromotion.$inject = ['PromotionsService'];

  function newPromotion(PromotionsService) {
    return new PromotionsService();
  }
}());
