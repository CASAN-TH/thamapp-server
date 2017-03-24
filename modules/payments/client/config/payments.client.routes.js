(function () {
  'use strict';

  angular
    .module('payments')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('payments', {
        abstract: true,
        url: '/payments',
        template: '<ui-view/>'
      })
      .state('payments.list', {
        url: '',
        templateUrl: 'modules/payments/client/views/list-payments.client.view.html',
        controller: 'PaymentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Payments List'
        }
      })
      .state('payments.create', {
        url: '/create',
        templateUrl: 'modules/payments/client/views/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: newPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Payments Create'
        }
      })
      .state('payments.edit', {
        url: '/:paymentId/edit',
        templateUrl: 'modules/payments/client/views/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Payment {{ paymentResolve.name }}'
        }
      })
      .state('payments.view', {
        url: '/:paymentId',
        templateUrl: 'modules/payments/client/views/view-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          pageTitle: 'Payment {{ paymentResolve.name }}'
        }
      })
      .state('aps', {
        abstract: true,
        url: '/ap',
        template: '<ui-view/>'
      })
      .state('aps.list', {
        url: '',
        templateUrl: 'modules/payments/client/views/ap/list-payments.client.view.html',
        controller: 'PaymentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'AP List'
        }
      })
      .state('aps.create', {
        url: '/create',
        templateUrl: 'modules/payments/client/views/ap/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: newPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Payments Create'
        }
      })
      .state('aps.edit', {
        url: '/:paymentId/edit',
        templateUrl: 'modules/payments/client/views/ap/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Payment {{ paymentResolve.name }}'
        }
      })
      .state('aps.view', {
        url: '/:paymentId',
        templateUrl: 'modules/payments/client/views/ap/view-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          pageTitle: 'Payment {{ paymentResolve.name }}'
        }
      })
      .state('ars', {
        abstract: true,
        url: '/ars',
        template: '<ui-view/>'
      })
      .state('ars.list', {
        url: '',
        templateUrl: 'modules/payments/client/views/ar/list-payments.client.view.html',
        controller: 'PaymentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'AR List'
        }
      })
      .state('ars.create', {
        url: '/create',
        templateUrl: 'modules/payments/client/views/ar/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: newPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Payments Create'
        }
      })
      .state('ars.edit', {
        url: '/:paymentId/edit',
        templateUrl: 'modules/payments/client/views/ar/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Payment {{ paymentResolve.name }}'
        }
      })
      .state('ars.view', {
        url: '/:paymentId',
        templateUrl: 'modules/payments/client/views/ar/view-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          pageTitle: 'Payment {{ paymentResolve.name }}'
        }
      })
      .state('rvs', {
        abstract: true,
        url: '/rv',
        template: '<ui-view/>'
      })
      .state('rvs.list', {
        url: '',
        templateUrl: 'modules/payments/client/views/rv/list-payments.client.view.html',
        controller: 'PaymentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'RV List'
        }
      })
      .state('rvs.create', {
        url: '/create',
        templateUrl: 'modules/payments/client/views/rv/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: newPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Payments Create'
        }
      })
      .state('rvs.edit', {
        url: '/:paymentId/edit',
        templateUrl: 'modules/payments/client/views/rv/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Payment {{ paymentResolve.name }}'
        }
      })
      .state('rvs.view', {
        url: '/:paymentId',
        templateUrl: 'modules/payments/client/views/rv/view-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          pageTitle: 'Payment {{ paymentResolve.name }}'
        }
      })
      .state('ajs', {
        abstract: true,
        url: '/aj',
        template: '<ui-view/>'
      })
      .state('ajs.list', {
        url: '',
        templateUrl: 'modules/payments/client/views/aj/list-payments.client.view.html',
        controller: 'PaymentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'AJ List'
        }
      })
      .state('ajs.create', {
        url: '/create',
        templateUrl: 'modules/payments/client/views/aj/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: newPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Payments Create'
        }
      })
      .state('ajs.edit', {
        url: '/:paymentId/edit',
        templateUrl: 'modules/payments/client/views/aj/form-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Payment {{ paymentResolve.name }}'
        }
      })
      .state('ajs.view', {
        url: '/:paymentId',
        templateUrl: 'modules/payments/client/views/aj/view-payment.client.view.html',
        controller: 'PaymentsController',
        controllerAs: 'vm',
        resolve: {
          paymentResolve: getPayment
        },
        data: {
          pageTitle: 'Payment {{ paymentResolve.name }}'
        }
      });
  }

  getPayment.$inject = ['$stateParams', 'PaymentsService'];

  function getPayment($stateParams, PaymentsService) {
    return PaymentsService.get({
      paymentId: $stateParams.paymentId
    }).$promise;
  }

  newPayment.$inject = ['PaymentsService'];

  function newPayment(PaymentsService) {
    return new PaymentsService();
  }
} ());
