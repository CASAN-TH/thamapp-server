(function () {
  'use strict';

  angular
    .module('payments')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('statementincomereport', {
        url: '/statementincomereport',
        templateUrl: 'modules/payments/client/views/statementincomereport.client.view.html',
        controller: 'StatementincomereportController',
        controllerAs: 'vm'
      })
      .state('samplereport', {
        url: '/samplereport',
        templateUrl: 'modules/payments/client/views/samplereport.client.view.html',
        controller: 'SamplereportController',
        controllerAs: 'vm'
      })
      .state('journal', {
        url: '/journal',
        templateUrl: 'modules/payments/client/views/journal.client.view.html',
        controller: 'JournalController',
        controllerAs: 'vm'
      })
      .state('ledgerreport', {
        url: '/ledgerreport',
        templateUrl: 'modules/payments/client/views/ledgerreport.client.view.html',
        controller: 'LedgerreportController',
        controllerAs: 'vm'
      })
      .state('pvs', {
        abstract: true,
        url: '/pvs',
        template: '<ui-view/>'
      })
      .state('pvs.list', {
        url: '',
        templateUrl: 'modules/payments/client/views/list-payments.client.view.html',
        controller: 'PaymentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Payments List'
        }
      })
      .state('pvs.create', {
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
      .state('pvs.edit', {
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
      .state('pvs.view', {
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
        url: '/aps',
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
        url: '/rvs',
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
      .state('jvs', {
        abstract: true,
        url: '/jvs',
        template: '<ui-view/>'
      })
      .state('jvs.list', {
        url: '',
        templateUrl: 'modules/payments/client/views/jv/list-payments.client.view.html',
        controller: 'PaymentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'JV List'
        }
      })
      .state('jvs.create', {
        url: '/create',
        templateUrl: 'modules/payments/client/views/jv/form-payment.client.view.html',
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
      .state('jvs.edit', {
        url: '/:paymentId/edit',
        templateUrl: 'modules/payments/client/views/jv/form-payment.client.view.html',
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
      .state('jvs.view', {
        url: '/:paymentId',
        templateUrl: 'modules/payments/client/views/jv/view-payment.client.view.html',
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
